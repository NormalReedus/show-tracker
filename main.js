require('dotenv').config()

const Show = require('./Show')
// TODO create categories classes (that can create shows)
// TODO make sure an empty response on show creation does not create a show
// TODO return helpful errors when stuff returns nothing that can be displayed in frontend
// TODO fix disambiguation when creating a show
// use the api endpoint that returns a list of possible options and filter movies off
// get a few details about the options (year, seasons, poster) so the frontend can display information needed for choosing
// make sure everything else than #init() uses IDs so disambiguation is just done once

//* Data stuctures:
//  An array of categories (Magnus, Magnus & Helena, etc.)
//		An array of shows (Breaking Bad etc)
//			{
//				imdbId: string,
//				tvmazeId: string,
//				title: string,
//				poster: string (url),
//				lastWatched: {
//					seasonNum: byte (uint8),
//					episodeNum: byte (uint8) (only display season if episode is the last in season)
//				},
//				totalSeasons: byte, (directly from omdb)
//				(nil if there is no next episode)
//				nextEpisode: nil || {
//					imdbId: string,
//					tvmazeId string,
//					length: nil || uint16 (minutes),
//					airDate: nil || Date (or string?)
//				},
//				airedEpisodesLeft: uint16
//			}

//* You should be able to tell from the overview
// Name of show
// last watched season (and episode)
// length of next episode
// air date of next episode (if it hasn't aired)
// (maybe) number of aired episodes left

//* You should be able to do
// Basic filter of shows
// Increment watched episode with a tap (and decrement for ez error correction)
// Manual override (select season & episode from dropdown / number select wheel) with a small icon in the corner?
// Favorite shows, so they show up at the top
// Add show

async function main() {
  const show = new Show('the flash')

  setTimeout(async () => {
    //* Watch test
    // for (let i = 0; i < 32; i++) {
    //   await show.watchEpisode()
    //   console.log(show.lastWatched)
    //   console.log(show.nextRuntime)
    // }
    //* Unwatch test
    // for (let i = 0; i < 32; i++) {
    //   await show.unwatchEpisode()
    //   console.log(show.lastWatched)
    // }
    //* Set test
    // for (let i = 0; i < 3; i++) {
    //   for (let j = 0; j <= 22; j++) {
    //     await show.setEpisode(i, j)
    //   }
    // }
    //* Test favorite
    // console.log(show)
    // show.toggleFavorite()
    // console.log(show)
  }, 2000)
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

main()
