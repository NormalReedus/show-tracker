require('dotenv').config()

const { getJson, omdbGet, tvmGetNextEpHref } = require('./services')

// How often to check for new data (so we don't make requests on all interactions)
const UPDATE_INTERVAL_HOURS = 12

//! handle if omdb and tvm cannot find the resource

async function main() {
  // const testUrl = process.env.TVMAZE_API_URL + '/lookup/shows?imdb=tt8712204'
  // console.log(await getJson(testUrl))

  // console.log(omdbGetSeason('123&this'))
  // console.log(urlSerializer('http://google.com', { hello: 'alright', this: 1337 }))
  // console.log(await omdbGet({ imdbId: 'tt8712204' }))
  // console.log(await tvmGetEpisode(await tvmGetNextEpHref('tt8712204')))

  // console.log(await tvmGetShow("batwoman"))

  const show = new Show('batwoman')

  setTimeout(() => {
    console.log(show)
  }, 2000)

  show._update()
}

// async function tvmGetShow(title) {
//   const tvmBaseUrl = process.env.TVMAZE_API_URL
//   const baseUrl = tvmBaseUrl + "/singlesearch/shows"

//   const queryParams = {
//     q: title,
//     embed: "episodes",
//   }

//   const reqUrl = urlSerializer(baseUrl, queryParams)

//   const res = await getJson(reqUrl)

//   return res
// }

// // Takes a tvm url and returns the episode at that url
// async function tvmGetEpisode(url) {
//   return await getJson(url)
// }

//* CLASSES
class Show {
  constructor(title) {
    this.lastUpdated = Date.now()
    this.lastWatched = {
      seasonNum: 0,
      episodeNum: 0,
    }
    // Null props are set in _init()
    this.title = null
    this.poster = null
    this.imdbId = null
    this.totalSeasons = null
    this.seasons = null
    this.nextAirDate = null // Next airing ep (not the next after the one watched)
    this.nextRuntime = null // Next after the one watched
    this.episodesLeft = null

    this._init(title)
  }

  async _init(title) {
    const res = await omdbGet({ title })

    this.title = res.Title
    this.poster = res.Poster
    this.imdbId = res.imdbID
    this.totalSeasons = res.totalSeasons

    this._setNextAirDate()
    this._setSeasons().then((res) => {
      this._setNextRuntime()
      this._setEpisodesLeft()
    })
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
      season.Episodes = season.Episodes.filter((ep) => ep.Released !== 'N/A')
    }

    this.seasons = seasons
  }

  async _setNextRuntime() {
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

  // Call this before accessing any props that are fetched from APIS
  async _update() {
    if (!this._shouldUpdate) return

    //* use above methods to update all data (kinda like _init, but using imdbID instead of title etc)
  }

  // Whether the update time interval has passed or not
  get _shouldUpdate() {
    const intervalMs = UPDATE_INTERVAL_HOURS * 60 * 60 * 1000

    return Date.now() - intervalMs > this.lastUpdated
  }
}

main()
