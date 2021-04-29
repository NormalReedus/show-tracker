const fetch = require("node-fetch")
const querystring = require("querystring")

// Returns the JSON response of a GET request to the given api
async function getJson(reqUrl) {
  let content
  try {
    res = await fetch(reqUrl)
    content = await res.json()
  } catch (err) {
    console.error("Could not fetch: " + reqUrl, err)
    //! Do stuff
    return
  }

  return content
}

// Use getJson to return a show, season or episode from OMDB by IMDB ID
async function omdbGet({ imdbId, seasonNum, title }) {
  const omdbBaseUrl = process.env.OMDB_API_URL
  const apiKey = process.env.OMDB_API_KEY

  // seasonNum is ignored if not passed
  const queryParams = {
    apiKey,
    i: imdbId,
    t: title,
    season: seasonNum,
  }

  const reqUrl = urlSerializer(omdbBaseUrl, queryParams)

  const res = await getJson(reqUrl)

  return res
}

// Finds a show on tvm by imdbId and returns the tvm href of next airing episode
async function tvmGetNextEpHref(imdbId) {
  const tvmBaseUrl = process.env.TVMAZE_API_URL

  const baseUrl = tvmBaseUrl + "/lookup/shows"

  const queryParams = {
    imdb: imdbId,
  }

  const reqUrl = urlSerializer(baseUrl, queryParams)

  const res = await getJson(reqUrl)

  if (!res._links.nextepisode) {
    console.log("There is no next airing episode for IMDB: " + imdbId)
    return
  }

  return res._links.nextepisode.href
}

//* UTILS
function urlSerializer(baseUrl, params) {
  const queryParams = querystring.stringify(params)
  return baseUrl + "?" + queryParams
}

module.exports = {
  getJson,
  omdbGet,
  tvmGetNextEpHref,
}
