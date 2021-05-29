const { getJson, omdbGet, tvmGetNextEpHref } = require('./services')

// TODO: add something that displays if a show is completely done
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
		this.progress = {
			seasonNum: 0, // 0-indexed because of special s0
			episodeNum: 0, // 1-indexed for everything, but handled specially for s0
		}
		this.favorite = false
		// null props are set in init()
		this.title = null
		this.poster = null
		this.imdbId = null
		// only ever set this to the actual show's .totalSeasons (returned from OMDB show request, not season request etc)
		// for consistency since we manipulate this sometimes if there is an unreleased season
		this.totalSeasons = null // should only be used when setting seasons, otherwise use this.seasons.length
		this.seasons = null
		this.nextAirDate = null // next airing ep (not the next after the one watched)
		this.nextRuntime = null // next after the one watched
		this.episodesLeft = null
	}

	//* SETTING / UPDATING PROPS

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
			this.nextAirDate = false // false to signal that is has checked, and there is none
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

		// clean up episodes and seasons
		for (const [i, season] of seasons.entries()) {
			// for some reason there are non-released eps included
			season.Episodes = season.Episodes.filter(ep => ep.Released !== 'N/A')

			// sometimes a new season is announced, but the eps are N/A, which creates an empty season
			// remove latest seasons if they are the empty i.e. does not yet have any released eps
			if (i === seasons.length - 1 && season.Episodes.length === 0) {
				seasons.pop()

				// we decrement totalSeasons to match that we removed the empty season
				// totalSeasons is used to loop through seasons during runtime, so we will get an out of bounds error if we don't do this
				// whenever this func is called (init and update), we reset totalSeasons to the original
				// which will allow us to catch if new eps are released in the latest season, and in that case the season will not be popped
				this.totalSeasons--
			}
		}

		this.seasons = seasons
	}

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

		// start iterator on the current season, since there is no need to count episodes of a whole (previous) season that is already watched
		// seasonNum is 1 indexed, so we init iterator to seasonNum - 1
		// but if seasonNum is 0 (not even started), we also just start at index 0
		for (let i = Math.max(0, this.progress.seasonNum - 1); i < this.seasons.length; i++) {
			epsInSeasons += this.seasons[i].Episodes.length
		}

		// subtract the number of eps watched in current season
		this.episodesLeft = epsInSeasons - this.progress.episodeNum
	}

	//* SHORTCUTS

	get currentSeason() {
		// if we haven't started watching, current season is also just first season
		if (this.progress.seasonNum === 0) {
			return this.seasons[0]
		}

		return this.seasons[this.progress.seasonNum - 1]
	}

	get _nextSeason() {
		// returns null when on last season
		if (this.progress.seasonNum === this.seasons.length) return null

		// when seasonNum is 0 (not begun watching yet), next season is index 0 as well (the first season)
		// which is the only case in which the first season can be the nextSeason
		// (and also currentSeason at the same time, since these are used for different things)
		return this.seasons[this.progress.seasonNum]
	}

	// only used for _setNextRuntime
	get _nextEpisode() {
		if (this.progress.episodeNum === this.currentSeason.Episodes.length) {
			if (!this._nextSeason) {
				// we are on last episode of last season
				return null
			}

			// we are on last episode of non-last season
			return this._nextSeason.Episodes[0]
		}

		// we are not on last episode of season
		// the following line even holds true if we have not begun watching (s0, e0), since s0 can only have e0, and currentSeason in that case actually returns s1,
		// where s1 episode index 0 is the actual next episode
		return this.currentSeason.Episodes[this.progress.episodeNum]
	}

	// returns a list of season numbers for the frontend
	get seasonNums() {
		// array of season numbers from 0 (not begun watching) to last season
		const nums = []
		// 0 and .length included, since seasonNums are actually 1-indexed, but 0 has semantic meaning
		for (let i = 0; i <= this.seasons.length; i++) {
			nums.push(i)
		}

		return nums
	}

	getSeasonEpisodeNums(seasonNum) {
		// if user is trying to say they have watched nothing
		// don't allow anything but 'nothing' as the episode either
		if (seasonNum === 0) return [0]

		// this is not currentSeason, since seasonNum is passed in from user
		const seasonLength = this.seasons[seasonNum - 1].Episodes.length

		// array of episode numbers from 1 to last ep of season
		const nums = []
		// 0 not included since it is already handled in the top statement of this function
		for (let i = 1; i <= seasonLength; i++) {
			nums.push(i)
		}

		return nums
	}

	// whether the update time interval has passed or not
	get _shouldUpdate() {
		function hrsToMs(hrs) {
			return hrs * 60 * 60 * 1000
		}

		const intervalMs = hrsToMs(Show.UPDATE_INTERVAL_HOURS)

		return Date.now() - intervalMs > this.lastUpdated
	}

	//* ACTIONS

	// call this before accessing any props that are fetched from APIS
	async update() {
		if (!this._shouldUpdate) return

		const res = await omdbGet({ imdbId: this.imdbId })
		this.totalSeasons = res.totalSeasons // needed for _setSeasons()

		await Promise.all([this._setNextAirDate(), this._setSeasons()])

		// Await the last block to make sure update() always finished completely when awaited
		await Promise.all([this._setNextRuntime(), this._setEpisodesLeft()])

		this.lastUpdated = Date.now()
	}

	async setProgress({ seas, ep }) {
		this.update()

		// setting s0 (not begun watching) only allows e0
		if (seas === 0) {
			this.progress = {
				seasonNum: 0,
				episodeNum: 0,
			}

			await this._setEpisodesLeft()
			return
		}

		// no season under 1 (0 is handled above) or above the number of seasons available
		if (seas < 1 || seas > this.seasons.length) return

		// no eps under 1 or higher than season length
		if (ep < 1 || ep > this.seasons[seas - 1].Episodes.length) return

		this.progress = {
			seasonNum: seas,
			episodeNum: ep,
		}

		// always update episodes left (even if update does not run)
		await this._setEpisodesLeft()
	}

	async watchEpisode() {
		this.update()

		if (this.progress.seasonNum === 0) {
			// we haven't started watching
			this.progress = {
				seasonNum: 1,
				episodeNum: 1,
			}
			await this._setEpisodesLeft()
			return
		}

		const seasonLength = this.currentSeason.Episodes.length

		if (this.progress.episodeNum === seasonLength) {
			// _nextSeason is always falsy on last season
			if (!this._nextSeason) {
				// we are on last ep of last season
				return
			}

			// we are on last ep of non-last season
			this.progress.seasonNum++
			this.progress.episodeNum = 1

			await this._setEpisodesLeft()
			return
		}

		// we are in the middle of a season
		this.progress.episodeNum++

		await this._setEpisodesLeft()
	}

	async unwatchEpisode() {
		this.update()

		// haven't started watching - can't go lower
		if (this.progress.seasonNum === 0) return

		if (this.progress.episodeNum === 1) {
			if (this.progress.seasonNum === 1) {
				// we are on first ep of first season
				this.progress = {
					seasonNum: 0,
					episodeNum: 0,
				}

				await this._setEpisodesLeft()
				return
			}

			// we are on first episode of non-first season
			this.progress.seasonNum--
			// currentSeason has now changed to the (when this function was called) previous season
			this.progress.episodeNum = this.currentSeason.Episodes.length
		}

		// we are in the middle of a season
		this.progress.episodeNum--

		await this._setEpisodesLeft()
	}

	toggleFavorite() {
		this.favorite = !this.favorite
	}
}

module.exports = Show
