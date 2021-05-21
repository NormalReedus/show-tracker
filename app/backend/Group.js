const Show = require('./Show')

class Group {
	static importGroups(jsonData) {
		// objects with no methods etc
		let staticData

		try {
			staticData = JSON.parse(jsonData)
		} catch (err) {
			//! Show alert popup
			console.log(err, 'Cannot parse JSON groups')
			return
		}

		const groups = staticData.map(staticGroup => {
			// Create actual group object from the static parsed json data
			const group = new Group(staticGroup.title)

			//! Import shows, should return array, loop through array and addShow
			const shows = Show.importShows(staticGroup.shows)

			for (const show of shows) {
				// Does not use addShow() since we already have the fully generated show
				group.shows.push(show)
			}

			return group
		})

		return groups
	}

	constructor(title) {
		this.title = title
		this.shows = []
	}

	async addShow(title) {
		// Shows are sync, but initializes async
		const show = new Show()

		// All processes in init will throw error if something goes fatally wrong
		// in which case we just don't save the show in this.shows
		try {
			await show.init(title)
		} catch (err) {
			console.error(err)
			return `There was an error creating the show '${title}'.`
		}

		this.shows.push(show)
	}

	removeShow(imdbId) {
		const showIndex = this.shows.findIndex(show => show.imdbId === imdbId)

		this.shows.splice(showIndex, 1)
	}

	showExists(title) {
		const match = this.shows.find(show => show.title.toLowerCase() === title.toLowerCase())

		return match
	}
}

module.exports = Group
