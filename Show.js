const { getJson, omdbGet, tvmGetNextEpHref } = require('./services')

// How often to check for new data (so we don't make requests on all interactions)
const UPDATE_INTERVAL_HOURS = 6

//! handle if omdb and tvm cannot find the resource
class Show {
  //? can any of these be private? E.g. the ones that are only used, but not in the UI
  constructor(title) {
    this.lastUpdated = Date.now()
    this.lastWatched = {
      seasonNum: 0,
      episodeNum: 0,
    }
    // Null props are set in init()
    this.title = null
    this.poster = null
    this.imdbId = null
    this.totalSeasons = null
    this.seasons = null
    this.nextAirDate = null // Next airing ep (not the next after the one watched)
    this.nextRuntime = null // Next after the one watched
    this.episodesLeft = null

    this.#init(title)
  }

  //* SETTING / UPDATING PROPS

  async #init(title) {
    // Everything depends on this going first
    const res = await omdbGet({ title })

    this.title = res.Title
    this.poster = res.Poster
    this.imdbId = res.imdbID
    this.totalSeasons = res.totalSeasons

    this.#setNextAirDate()
    await this.#setSeasons() // Last 2 depends on this
    this.#setNextRuntime()
    this.#setEpisodesLeft()
  }

  async #setNextAirDate() {
    const href = await tvmGetNextEpHref(this.imdbId)

    if (!href) {
      this.nextAirDate = false
      return
    }

    const res = await getJson(href)
    this.nextAirDate = res.airdate
  }

  async #setSeasons() {
    const seasonPromises = []
    for (let s = 1; s <= this.totalSeasons; s++) {
      // omdb is 1 indexed
      const season = omdbGet({ imdbId: this.imdbId, seasonNum: s })
      seasonPromises.push(season)
    }

    const seasons = await Promise.all(seasonPromises)

    // for some reason there are non-released eps included
    for (const season of seasons) {
      season.Episodes = season.Episodes.filter((ep) => ep.Released !== 'N/A')
    }

    this.seasons = seasons
  }

  //! Split function into something that finds next episode that can be used elsewhere as well as here
  async #setNextRuntime() {
    // local seasons array is 0 indexed
    let season = this.seasons[this.lastWatched.seasonNum]
    let nextEp

    // if last watched was last of season and another season exists
    if (
      this.lastWatched.episodeNum === season.Episodes.length &&
      this.lastWatched.seasonNum + 1 < this.totalSeasons
    ) {
      // check for ep in next season
      season = this.seasons[this.lastWatched.seasonNum + 1]
      nextEp = season.Episodes[0]
    } else if (this.lastWatched.episodeNum === season.Episodes.length) {
      // last ep of last season
      this.nextRuntime = false
      return
    } else {
      // there are more episodes in this season
      nextEp = season.Episodes[this.lastWatched.episodeNum]
    }

    // there's no runtime info in the season list of eps
    const fullEp = await omdbGet({ imdbId: nextEp.imdbID })

    this.nextRuntime = fullEp.Runtime
  }

  async #setEpisodesLeft() {
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
  get #shouldUpdate() {
    const intervalMs = UPDATE_INTERVAL_HOURS * 60 * 60 * 1000

    return Date.now() - intervalMs > this.lastUpdated
  }

  //* SHORTCUTS
  get #currentSeason() {
    return this.seasons[this.lastWatched.seasonNum]
  }

  //* CONTROLLERS

  //! make this private if not used from outside
  //* Call this before accessing any props that are fetched from APIS
  async update() {
    if (!this.#shouldUpdate) return

    const res = await omdbGet({ imdbId: this.imdbId })
    this.totalSeasons = res.totalSeasons // Needed for the rest

    this.#setNextAirDate()
    await this.#setSeasons()

    // Await the last block to make sure update() always finished completely when awaited
    await Promise.all([this.#setNextRuntime(), this.#setEpisodesLeft()])

    this.lastUpdated = Date.now()
  }

  async watchEpisode() {
    await this.update()

    const seasonLength = this.#currentSeason.Episodes.length

    if (this.lastWatched.episodeNum < seasonLength - 1) {
      // If next episode is not last episode of season
      this.lastWatched.episodeNum++
    } else if (this.lastWatched.seasonNum < this.totalSeasons - 1) {
      // Last episode of season, but there is another season
      this.lastWatched.seasonNum++
      this.lastWatched.episodeNum = 0
    }

    // Last ep of last season
    //? Return a message?
  }

  async unwatchEpisode() {
    //TODO: this
  }
}

module.exports = Show
