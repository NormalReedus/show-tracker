const { getJson, omdbGet, tvmGetNextEpHref } = require('./services')

// TODO: add something that displays if a show is done
// use both the prop from API that shows if the the show is running and whether the client is at the last episode and season with / without a next air date

class Show {
	// how often to check for new data (so we don't make requests on all interactions)
	static UPDATE_INTERVAL_HOURS = 6

	// converts static dicts to Show objects (with methods) without calling any APIs
	static importShows(staticShows) {
		const shows = staticShows.map(staticShow => {
			// make new show with methods etc and overwrite all the props that also exist on staticShow with those of staticShow
			// we don't use init since we have all the props
			const show = Object.assign(new Show(), staticShow)

			return show
		})

		return shows
	}

	constructor() {
		this.lastUpdated = Date.now()
		this.lastWatched = {
			seasonNum: 1,
			episodeNum: 0,
		}
		this.favorite = false
		// null props are set in init()
		this.title = null
		this.poster = null
		this.imdbId = null
		this.totalSeasons = null
		this.seasons = null
		this.nextAirDate = null // next airing ep (not the next after the one watched)
		this.nextRuntime = null // next after the one watched
		this.episodesLeft = null
	}

	//* SETTING / UPDATING PROPS

	// no error handling here, this is done in Group
	async init(title) {
		// everything depends on this going first
		const res = await omdbGet({ title })

		this.title = res.Title
		this.poster = res.Poster
		this.imdbId = res.imdbID
		this.totalSeasons = res.totalSeasons

		await Promise.all([
			this._setNextAirDate(),
			this._setSeasons(), // last 2 depend on this
		])
		await Promise.all([this._setNextRuntime(), this._setEpisodesLeft()])
	}

	async _setNextAirDate() {
		const href = await tvmGetNextEpHref(this.imdbId)

		if (!href) {
			this.nextAirDate = false
			return
		}

		const res = await getJson(href)
		this.nextAirDate = res.airdate
	}

	async _setSeasons() {
		const seasonPromises = []
		// seasons are 1 indexed on the API
		for (let s = 1; s <= this.totalSeasons; s++) {
			// omdb is 1 indexed
			const season = omdbGet({ imdbId: this.imdbId, seasonNum: s })
			seasonPromises.push(season)
		}

		const seasons = await Promise.all(seasonPromises)

		// for some reason there are non-released eps included
		for (const season of seasons) {
			season.Episodes = season.Episodes.filter(ep => ep.Released !== 'N/A')
		}

		this.seasons = seasons
	}

	// TODO: eventuelt skriv denne om til bare at fetche runtime fra nuværende episode / show, da det ikke lader til at være forskelligt fra ep til ep
	async _setNextRuntime() {
		const nextEp = this._nextEpisode
		if (!nextEp) {
			this.nextRuntime = false
			return
		}

		// there's no runtime info in the season list of eps
		const fullEp = await omdbGet({ imdbId: nextEp.imdbID })

		this.nextRuntime = fullEp.Runtime
	}

	async _setEpisodesLeft() {
		let epsInSeasons = 0

		// only loop through seasons we have not fully watched
		// use seasonNum directly since this.seasons is 0 indexed (in contrast to the API)
		for (let s = this.lastWatched.seasonNum - 1; s < this.totalSeasons; s++) {
			epsInSeasons += this.seasons[s].Episodes.length
		}

		// subtract the number of eps watched in current season
		this.episodesLeft = epsInSeasons - this.lastWatched.episodeNum
	}

	// whether the update time interval has passed or not
	get _shouldUpdate() {
		function hrsToMs(hrs) {
			return hrs * 60 * 60 * 1000
		}

		const intervalMs = hrsToMs(Show.UPDATE_INTERVAL_HOURS)

		return Date.now() - intervalMs > this.lastUpdated
	}

	//* SHORTCUTS

	get _currentSeason() {
		// returns undefined when last season has been watched
		return this.seasons[this.lastWatched.seasonNum - 1]
	}

	get _nextSeason() {
		// returns undefined when on last season or having watched last season

		if (this.lastWatched.episodeNum === 0) {
			// no eps watched of season means that next season us currently index of lastwatched.seasonNum
			return this._currentSeason
		}

		return this.seasons[this.lastWatched.seasonNum]
	}

	get _nextEpisode() {
		// returns undefined when there is no next episode
		if (!this._currentSeason) {
			// last season has been watched
			return
		}

		// there are more episodes in this season
		// 'this season' being either the one in progress or the one just started
		return this._currentSeason.Episodes[this.lastWatched.episodeNum]
	}

	// returns a list of season numbers
	get seasonNums() {
		const indices = this.seasons.map((_, index) => index + 1)

		// we add one seasonNum to the list, since client can have watched the last season
		// e.g. with 8 seasons nums could be 1, ..., 8, we want client to be able to say they have started the 9th season as well
		indices.push(indices.length + 1)

		return indices
	}

	getSeasonEpisodeNums(seasonNum) {
		// trying to get eps for season after the last (when all have been watched), you can only set ep to 0
		if (seasonNum === this.seasons.length + 1) {
			//! +1
			return [0]
		}

		return this.seasons[seasonNum - 1].Episodes.map((_, index) => index)
	}

	//* CONTROLLERS

	// call this before accessing any props that are fetched from APIS
	async update() {
		if (!this._shouldUpdate) return

		const res = await omdbGet({ imdbId: this.imdbId })
		this.totalSeasons = res.totalSeasons // needed for the rest

		this._setNextAirDate()
		await this._setSeasons()

		// Await the last block to make sure update() always finished completely when awaited
		await Promise.all([this._setNextRuntime(), this._setEpisodesLeft()])

		this.lastUpdated = Date.now()
	}

	async setProgress({ seas, ep }) {
		// await this.update()
		this.update()

		// setting season to last season (everything watched) only allows episode to be 0, so it is set to 0 regardless of ep's value
		if (seas === this.seasons.length + 1) {
			this.lastWatched = {
				seasonNum: seas,
				episodeNum: 0,
			}

			await this._setEpisodesLeft()
			return
		}

		// TODO: sørg for at man enten kan sige at man har set sidste afsnit af en sæson ELLER at man har set en hel sæson
		// no negative eps or higher than season length
		if (ep < 0 || ep > this.seasons[seas - 1].Episodes.length - 1) return // TODO: giv fejl-popup

		this.lastWatched = {
			seasonNum: seas,
			episodeNum: ep,
		}

		// always update episodes left (even if update does not run)
		await this._setEpisodesLeft()
	}

	async watchEpisode() {
		// await this.update()
		this.update()

		if (!this._currentSeason) {
			// all seasons have been watched
			return
		}

		const seasonLength = this._currentSeason.Episodes.length

		if (this.lastWatched.seasonNum === this.seasons.length + 1) {
			// all seasons have been watched, episodeNum can only be 0 here
			return
		}

		if (this.lastWatched.episodeNum < seasonLength - 1) {
			// if next episode is not last episode of season
			this.lastWatched.episodeNum++
		} else if (this.lastWatched.seasonNum < this.seasons.length + 1) {
			this.lastWatched.seasonNum++
			this.lastWatched.episodeNum = 0
		}

		// update episodes left when lastWatched changes
		await this._setEpisodesLeft()
	}

	async unwatchEpisode() {
		// await this.update()
		this.update()

		if (this.lastWatched.episodeNum === 0) {
			if (this.lastWatched.seasonNum === 1) {
				// no eps or seasons watched
				return
			}

			// season(s) watched, but no eps of the current season
			this.lastWatched.seasonNum--

			// selecting season after decrement is important, since we need the length of the currentSeason
			// _currentSeason is now 'the previous season' from when this func was called
			this.lastWatched.episodeNum = this._currentSeason.Episodes.length - 1

			// update episodes left when lastWatched changes
			await this._setEpisodesLeft()
			return
		}

		// in the middle of season
		this.lastWatched.episodeNum--

		// update episodes left when lastWatched changes
		await this._setEpisodesLeft()
	}

	toggleFavorite() {
		this.favorite = !this.favorite
	}
}

module.exports = Show
