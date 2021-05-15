const { getJson, omdbGet, tvmGetNextEpHref } = require('./services')

// How often to check for new data (so we don't make requests on all interactions)
const UPDATE_INTERVAL_HOURS = 6

// TODO: add something that displays if a show is done
// Use both the prop from API that shows if the the show is running and whether the client is at the last episode and season with / without a next air date

//! handle if omdb and tvm cannot find the resource on init
class Show {
	// Takes parsed shows from json, that do not have methods etc
	static importShows(staticShows) {
		console.log(staticShows)

		const shows = staticShows.map(staticShow => {
			// Make new show with methods etc and overwrite all the props that also exist on staticShow with those of staticShow
			// We don't use init since we have all the props
			const show = Object.assign(new Show(), staticShow)

			return show
		})

		return shows
	}

	constructor() {
		this.lastUpdated = Date.now()
		this.lastWatched = {
			seasonNum: 0,
			episodeNum: 0,
		}
		this.favorite = false
		// Null props are set in init()
		this.title = null
		this.poster = null
		this.imdbId = null
		this.totalSeasons = null
		this.seasons = null
		this.nextAirDate = null // Next airing ep (not the next after the one watched)
		this.nextRuntime = null // Next after the one watched
		this.episodesLeft = null
	}

	//* SETTING / UPDATING PROPS

	// No error handling here, this is done in Group
	async init(title) {
		// Everything depends on this going first
		const res = await omdbGet({ title })

		this.title = res.Title
		this.poster = res.Poster
		this.imdbId = res.imdbID
		this.totalSeasons = res.totalSeasons

		this._setNextAirDate()
		await this._setSeasons() // Last 2 depends on this
		this._setNextRuntime()
		this._setEpisodesLeft()
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
		// Seasons are 1 indexed on the API
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

	//TODO: Eventuelt skriv denne om til bare at fetche runtime fra nuværende episode / show, da det ikke lader til at være forskelligt fra ep til ep
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
		for (let s = this.lastWatched.seasonNum; s < this.totalSeasons; s++) {
			epsInSeasons += this.seasons[s].Episodes.length
		}

		// Subtract the number of eps watched in current season
		this.episodesLeft = epsInSeasons - this.lastWatched.episodeNum
	}

	// Whether the update time interval has passed or not
	get _shouldUpdate() {
		function hrsToMs(hrs) {
			return hrs * 60 * 60 * 1000
		}

		const intervalMs = hrsToMs(UPDATE_INTERVAL_HOURS)

		return Date.now() - intervalMs > this.lastUpdated
	}

	//* SHORTCUTS

	get _currentSeason() {
		// Returns undefined when last season has been watched
		return this.seasons[this.lastWatched.seasonNum]
	}

	get _nextSeason() {
		// Returns undefined when on last season or having watched last season

		if (this.lastWatched.episodeNum === 0) {
			// No eps watched of season means that next season us currently index of lastwatched.seasonNum
			return this.seasons[this.lastWatched.seasonNum]
		}

		return this.seasons[this.lastWatched.seasonNum + 1]
	}

	get _nextEpisode() {
		// Returns undefined when there is no next episode
		if (!this._currentSeason) {
			// Last season has been watched
			return
		}

		// There are more episodes in this season
		// 'this season' being either the one in progress or the one just started
		return this._currentSeason.Episodes[this.lastWatched.episodeNum]
	}

	// Returns a list of season numbers
	// 0th indexed since it is used by client to pick the lastWatched.seasonNum
	get seasonNums() {
		return this.seasons.map((_, index) => index)
	}

	//* CONTROLLERS

	// Call this before accessing any props that are fetched from APIS
	async update() {
		if (!this._shouldUpdate) return

		const res = await omdbGet({ imdbId: this.imdbId })
		this.totalSeasons = res.totalSeasons // Needed for the rest

		this._setNextAirDate()
		await this._setSeasons()

		// Await the last block to make sure update() always finished completely when awaited
		await Promise.all([this._setNextRuntime(), this._setEpisodesLeft()])

		this.lastUpdated = Date.now()
	}

	async setEpisode(seas, ep) {
		await this.update()

		// Setting season to last season (everything watched) only allows episode to be 0
		// since you cannot have watched episodes after watching the last season
		if (seas === this.seasons.length && ep !== 0) return //TODO: Giv fejl-popup

		// // Don't do anything if season does not exist
		// if (!this.seasons[seas]) return //! HVIS SÆSON ER 1 MERE END DE EKSISTERENDE skal man kun kunne sætte ep til 0

		//TODO: sørg for at man enten kan sige at man har set sidste afsnit af en sæson ELLER at man har set en hel sæson
		// No negative eps or higher than season length
		if (ep < 0 || ep > this.seasons[seas].Episodes.length - 1) return //TODO: Giv fejl-popup

		this.lastWatched = {
			seasonNum: seas,
			episodeNum: ep,
		}

		// Always update episodes left (even if update does not run)
		await this._setEpisodesLeft()
	}

	// Lige nu sætter den ep til sidste afsnit i sæson men bumper ikke. Og så er der ikke en ep 0 i andre sæsoner end 0
	async watchEpisode() {
		await this.update()
		if (!this._currentSeason) {
			// All seasons have been watched
			return
		}

		const seasonLength = this._currentSeason.Episodes.length

		if (this.lastWatched.seasonNum === this.seasons.length) {
			// All seasons have been watched, episodeNum can only be 0 here
			return
		}

		if (this.lastWatched.episodeNum < seasonLength - 1) {
			// If next episode is not last episode of season
			this.lastWatched.episodeNum++
		} else if (this.lastWatched.seasonNum < this.seasons.length) {
			this.lastWatched.seasonNum++
			this.lastWatched.episodeNum = 0
		}

		// } else if (this._nextSeason) {
		// 	//! MAN MÅ GODT INKREMENTERE seasonNum til at seasons[seasonNum] er 1 mere end dem, der findes (siden man har set hele den sidste sæson)
		// 	// Last episode of season, but there is another season
		// 	this.lastWatched.seasonNum++
		// 	this.lastWatched.episodeNum = 0
		// }

		// Last ep of last season
		//? Return a message?

		// Always update episodes left (even if update does not run)
		await this._setEpisodesLeft()
	}

	async unwatchEpisode() {
		await this.update()

		if (this.lastWatched.episodeNum === 0) {
			if (this.lastWatched.seasonNum === 0) {
				// No eps or seasons watched
				return
			}

			// season(s) watched, but no eps of the current season
			this.lastWatched.seasonNum--

			// Selecting season after decrement is important, since we need the length of the currentSeason
			// _currentSeason is now 'the previous season' from when this func was started
			this.lastWatched.episodeNum = this._currentSeason.Episodes.length - 1
			// Always update episodes left (even if update does not run)
			await this._setEpisodesLeft()
			return
		}

		// In the middle of season
		this.lastWatched.episodeNum--

		// Always update episodes left (even if update does not run)
		await this._setEpisodesLeft()
	}

	toggleFavorite() {
		this.favorite = !this.favorite
	}
}

module.exports = Show
