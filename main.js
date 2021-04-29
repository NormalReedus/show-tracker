const fetch = require('node-fetch')
require('dotenv').config()
const querystring = require('querystring')

//! handle if omdb and tvm cannot find the resource

async function main() {
    // const testUrl = process.env.TVMAZE_API_URL + '/lookup/shows?imdb=tt8712204'
    // console.log(await getJson(testUrl))

    // console.log(omdbGetSeason('123&this'))
    // console.log(urlSerializer('http://google.com', { hello: 'alright', this: 1337 }))
    // console.log(await omdbGet('tt8712204'))
}

main()

//* SERVICES
// Returns the JSON response of a GET request to the given api
async function getJson(reqUrl) {
    let content
    try {
        res = await fetch(reqUrl)
        content = await res.json()
    } catch (err) {
        console.error('Could not fetch: ' + reqUrl, err)
        //! Do stuff
        return
    }
    
    return content
}

// Use getJson to return a show, season or episode from OMDB by IMDB ID
async function omdbGet(imdbId, seasonNum) {
    const omdbBaseUrl = process.env.OMDB_API_URL
    const apiKey = process.env.OMDB_API_KEY

    // seasonNum is ignored if not passed
    const queryParams = {
        apiKey,
        i: imdbId,
        season: seasonNum
    }

    const reqUrl = urlSerializer(omdbBaseUrl, queryParams)

    const res = await getJson(reqUrl)

    return res
}

// Finds a show on tvm by imdbID and returns the tvm href of next airing episode
function tvmGetNextEpHref(imdbId) {
    const tvmBaseUrl = process.env.TVMAZE_API_URL

    const baseUrl = tvmBaseUrl + '/lookup/shows'

    const queryParams = {
        imdb: imdbId
    }

    const reqUrl = urlSerializer(baseUrl, queryParams)

    const res = await getJson(reqUrl)

    if (!res.nextepisode) {
        console.log('There is no next episode for IMDB: ' + imdbId)
        return
    }

    return res.nextepisode.href
}

// Takes a tvm url and returns the episode at that url
function tvmGetEpisode(url) {
	var ep tvmEpisode

	if err := json.Unmarshal(*getJson(reqUrl), &ep); err != nil {
		log.Fatalln("Could not parse json response")
	}

	if ep.Response == "False" {
		log.Fatalln(ep.Error)
	}

	return ep
}

//* UTILS
function urlSerializer(baseUrl, params) {
    const queryParams = querystring.stringify(params)
	return baseUrl + "?" + queryParams
}