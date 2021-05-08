require('dotenv').config()

const Group = require('./Group')

;(async () => {
  const group = new Group('Magnus & Helena')

  await Promise.all([group.addShow('batwoman')])

  console.log(group)

  group.removeShow('tt8712204')

  console.log(group)

  // console.log(group)
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
})()

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
