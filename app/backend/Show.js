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
		this.progress = {
			//! init as 0, 0
			//! 0, 0 should display as 'Not started' or just 0, 0 in frontend and should be treated differently everywhere
			//! that means that +1 will go directly to 1, 1 and -1 from there will go to 0, 0, but when at 0,0 there will be no looping through
			//! season or anything like that, this behaviour should be intercepted in the top of every function - ALWAYS check if 0,0 is the state
			//! and handle that differently than anything else
			seasonNum: 1,
			episodeNum: 0,
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
		// seasonNum is 1 indexed, this.seasons is not, so we init iterator to seasonNum - 1
		// but if seasonNum is 0 (not even started), we also just start at index 0
		//! use Math.max(0, this.progress.seasonNum - 1) to not go below index 0 if series is not even started
		for (let i = this.progress.seasonNum - 1; i < this.seasons.length; i++) {
			epsInSeasons += this.seasons[i].Episodes.length
		}

		// subtract the number of eps watched in current season
		this.episodesLeft = epsInSeasons - this.progress.episodeNum //! this should work as is - I promise
	}

	//* SHORTCUTS

	get _currentSeason() {
		// returns undefined when last season has been watched //! this should no longer apply, just remove comment
		//! if seasonNum === 0, return this.seasons[0]
		return this.seasons[this.progress.seasonNum - 1]
	}

	get _nextSeason() {
		// returns undefined when on last season or having watched last season //! should only apply when on last season, not having watched last season
		//! if this.progress.seasonNum === this.seasons.length return null

		//! remove this block
		if (this.progress.episodeNum === 0) {
			// no eps watched of season means that next season us currently index of progress.seasonNum
			return this._currentSeason
		}

		// when seasonNum is 0 (not begun watching yet), next season is index 0 as well (the first season)
		// which is the only case in which the first season can be the nextSeason
		// (and also currentSeason at the same time, since these are used for different things)
		return this.seasons[this.progress.seasonNum] //! keep this as default, since seasonNum starts at 1, it will always match the next season index
	}

	// only used for _setNextRuntime
	get _nextEpisode() {
		//! if this.progress.episodeNum === this._currentSeason.Episodes.length
		//! if !this._nextSeason - return nothing or null (depending on what nextRuntime wants)
		//! then return this._nextSeason.Episodes[0]

		//! if we are not on last ep of season, just return this._currentSeason.Episodes[this.progress.episodeNum] (current last / default line of this func)
		//! this even holds true if we are not begun (0, 0), since season 0 can only have ep 0, and currentSeason in that case actually returns season 1 as current,
		//! where season 1 episode index 0 is the actual next episode

		//! this block should be removed now that we cannot go beyond the last season
		// returns undefined when there is no next episode
		if (!this._currentSeason) {
			// last season has been watched
			return
		}

		// there are more episodes in this season
		// 'this season' being either the one in progress or the one just started
		return this._currentSeason.Episodes[this.progress.episodeNum]
	}

	// returns a list of season numbers for the frontend
	get seasonNums() {
		const indices = this.seasons.map((_, index) => index + 1)
		//! rewrite to for(let i = 1 .... .length)

		//! remove this, we don't need the extra dummy season
		// we add one seasonNum to the list, since client can have watched the last season
		// e.g. with 8 seasons nums could be 1, ..., 8, we want client to be able to say they have started the 9th season as well
		indices.push(indices.length + 1)

		return indices
	}

	getSeasonEpisodeNums(seasonNum) {
		//! remove this small block, we cannot set seasonNum beyond .length
		// trying to get eps for season after the last (when all have been watched), you can only set ep to 0
		if (seasonNum === this.seasons.length + 1) {
			return [0]
		}

		// if user is trying to say they have watched nothing
		// don't allow anything but 'nothing' as the episode either
		//! if seasonNum === 0
		//! return [0]

		const seasonEps = this.seasons[seasonNum - 1].Episodes //! const seasonLength = this.seasons[seasonNum - 1].Episodes.length

		return seasonEps.map((_, index) => index) //! return index + 1, but do it exactly like in seasonNums with the for loop instead: rewrite to for(let i = 1 .... seasonLength)
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

		//! change this block to only allow ep 0 on seas 0 instead of on length+1
		// setting season to last season (everything watched) only allows episode to be 0, so it is set to 0 regardless of ep's value
		if (seas === this.seasons.length + 1) {
			this.progress = {
				seasonNum: seas,
				episodeNum: 0,
			}

			await this._setEpisodesLeft()
			return
		}

		// no season under 1 (0 is handled above) or above the number of seasons available
		//! if seas < 1 || seas > this.seasons.length: return

		// no negative eps or higher than season length //! change to ep < 1 and seasonLength (not -1) - both in comment and code
		if (ep < 0 || ep > this.seasons[seas - 1].Episodes.length - 1) return

		this.progress = {
			seasonNum: seas,
			episodeNum: ep,
		}

		// always update episodes left (even if update does not run)
		await this._setEpisodesLeft()
	}

	async watchEpisode() {
		this.update()
		//! set shortcut variables for episode and season for the checks (cannot get around the full this. on assignment) - check if this makes sense

		//! remove, this is not possible
		if (!this._currentSeason) {
			// all seasons have been watched
			return
		}
		//! if this.progress.seasonNum === 0
		//! set seasonNum and episodeNum to 1 and _setEpisodesLeft and return

		const seasonLength = this._currentSeason.Episodes.length

		//! rewrite to:
		//! if this.progress.episodeNum === seasonLength
		//! if !this._nextSeason // _nextSeason is always false on last season
		// we are on last episode of last season
		//! return
		// we are on last episode of non-last season
		//! increment season, set ep to 1
		//! _setEpisodesLeft
		// we are in the middle of a season
		//! increment episodeNum

		//! delete everything from here except _setEpisodesLeft
		if (this.progress.seasonNum === this.seasons.length + 1) {
			// all seasons have been watched, episodeNum can only be 0 here
			return
		}

		if (this.progress.episodeNum < seasonLength - 1) {
			// if next episode is not last episode of season
			this.progress.episodeNum++
		} else if (this.progress.seasonNum < this.seasons.length + 1) {
			this.progress.seasonNum++
			this.progress.episodeNum = 0
		}

		// update episodes left when progress changes
		await this._setEpisodesLeft()
	}

	async unwatchEpisode() {
		this.update()
		//! set shortcut variables for episode and season for the checks (cannot get around the full this. on assignment) - check if this makes sense

		// haven't started watching, can't go lower
		//! if season === 0 return

		//! if episode === 1
		//! if season === 1
		// we are on first ep of first season
		//! set season to 0 and ep to 0 and _setEpisodesLeft and return
		// we are on first ep of non-first season
		//! decrement this.progress.seasonNum and AFTERWARDS set this.progress.episode to this._currentSeason.Episodes.length
		//! _setEpisodesLeft
		// we are in the middle of a season
		//! decrement this.progress.episodeNum

		//! remove from here except last setEpisodesLeft
		if (this.progress.episodeNum === 0) {
			if (this.progress.seasonNum === 1) {
				// no eps or seasons watched
				return
			}

			// season(s) watched, but no eps of the current season
			this.progress.seasonNum--

			// selecting season after decrement is important, since we need the length of the currentSeason
			// _currentSeason is now 'the previous season' from when this func was called
			this.progress.episodeNum = this._currentSeason.Episodes.length - 1

			// update episodes left when progress changes
			await this._setEpisodesLeft()
			return
		}

		// in the middle of season
		this.progress.episodeNum--

		// update episodes left when progress changes
		await this._setEpisodesLeft()
	}

	toggleFavorite() {
		this.favorite = !this.favorite
	}
}

module.exports = Show
