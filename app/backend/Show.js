const { getJson, omdbGet, tvmGetNextEpHref } = require('./services')

// How often to check for new data (so we don't make requests on all interactions)
const UPDATE_INTERVAL_HOURS = 6

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

	//! Split function into something that finds next episode that can be used elsewhere as well as here
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
		const intervalMs = UPDATE_INTERVAL_HOURS * 60 * 60 * 1000

		return Date.now() - intervalMs > this.lastUpdated
	}

	//* SHORTCUTS

	get _currentSeason() {
		return this.seasons[this.lastWatched.seasonNum]
	}

	get _nextSeason() {
		return this.seasons[this.lastWatched.seasonNum + 1]
	}

	get _nextEpisode() {
		if (
			this.lastWatched.episodeNum === this._currentSeason.Episodes.length &&
			this._nextSeason
		) {
			// if last watched was last of season and another season exists
			// check for ep in next season
			return this._nextSeason.Episodes[0]
		} else if (
			this.lastWatched.episodeNum === this._currentSeason.Episodes.length
		) {
			// last ep of last season
			return
		} else {
			// there are more episodes in this season
			return this._currentSeason.Episodes[this.lastWatched.episodeNum]
		}
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

		// Only set ep to 0 if it is to say no eps watched at all
		if (seas !== 0 && ep === 0) return

		// Don't do anything if season does not exist
		if (!this.seasons[seas]) return

		// No negative eps or higher than season length
		if (ep < 0 || ep > this.seasons[seas].Episodes.length) return

		this.lastWatched = {
			seasonNum: seas,
			episodeNum: ep,
		}
	}

	async watchEpisode() {
		await this.update()

		const seasonLength = this._currentSeason.Episodes.length

		if (this.lastWatched.episodeNum < seasonLength) {
			// If next episode is not last episode of season
			this.lastWatched.episodeNum++
		} else if (this._nextSeason) {
			// Last episode of season, but there is another season
			this.lastWatched.seasonNum++
			this.lastWatched.episodeNum = 1
		}

		// Last ep of last season
		//? Return a message?
	}

	async unwatchEpisode() {
		await this.update()

		// No eps or seasons watched
		if (this.lastWatched.episodeNum === 0 && this.lastWatched.seasonNum === 0)
			return

		if (this.lastWatched.episodeNum === 1) {
			if (this.lastWatched.seasonNum === 0) {
				// Only in first season can lastWatched.episodeNum go below 1 (saying no eps have been watched)
				this.lastWatched.episodeNum--
				return
			}

			// Watched season(s) and only 1 episode on current season
			this.lastWatched.seasonNum--

			// Selecting season after decrement is important
			// _currentSeason is now 'the previous season' from when this func was called
			this.lastWatched.episodeNum = this._currentSeason.Episodes.length
			return
		}

		// In the middle of a season
		this.lastWatched.episodeNum--
	}

	toggleFavorite() {
		this.favorite = !this.favorite
	}
}

module.exports = Show
