const querystring = require('querystring')

// returns the JSON response of a GET request to the given api
async function getJson(reqUrl) {
	let content
	try {
		res = await fetch(reqUrl)
		content = await res.json()
	} catch (err) {
		throw new Error('Could not fetch: ' + reqUrl)
	}

	return content
}

// use getJson to return a show, season or episode from OMDB by IMDB ID
async function omdbGet({ imdbId, seasonNum, title }) {
	const omdbBaseUrl = process.env.OMDB_API_URL
	const apiKey = process.env.OMDB_API_KEY

	// params are just ignored if they are not passed
	const queryParams = {
		apiKey,
		i: imdbId,
		t: title,
		type: title ? 'series' : null, // when getting a show from a title, only find 'series', not movies
		season: seasonNum,
	}

	const reqUrl = urlSerializer(omdbBaseUrl, queryParams)

	const res = await getJson(reqUrl)

	// only when creating show object are we using title
	if (title && res.Type !== 'series') {
		throw new Error('Cannot find show on OMDB: ' + title)
	}

	if (res.Response === 'False') {
		throw new Error('Cannot find resource on OMDB: ' + imdbId + ' - ' + seasonNum ? 'Season: ' + seasonNum : '')
	}

	return res
}

// finds a show on tvm by imdbId and returns the tvm href of next airing episode
async function tvmGetNextEpHref(imdbId) {
	const tvmBaseUrl = process.env.TVMAZE_API_URL

	const baseUrl = tvmBaseUrl + '/lookup/shows'

	const queryParams = {
		imdb: imdbId,
	}

	const reqUrl = urlSerializer(baseUrl, queryParams)

	const res = await getJson(reqUrl)

	if (!res) {
		throw new Error('There was an error finding the next air date for: ' + imdbId)
	}

	if (!res._links.nextepisode) {
		return
	}

	return res._links.nextepisode.href
}

//* UTILS
function urlSerializer(baseUrl, params) {
	const queryParams = querystring.stringify(params)
	return baseUrl + '?' + queryParams
}

module.exports = {
	getJson,
	omdbGet,
	tvmGetNextEpHref,
}
