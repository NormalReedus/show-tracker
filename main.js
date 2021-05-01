require('dotenv').config()

const Show = require('./Show')

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
    show.watchEpisode()
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
