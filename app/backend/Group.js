const Show = require('./Show')
// import Show from './Show'

class Group {
	constructor(title) {
		this.title = title
		this.shows = []
	}

	async addShow(title) {
		// Shows are sync, but initializes async
		if (this._showExists(title)) {
			//! Display in frontend
			console.log('This show already exists in this group')
			return
		}

		const show = new Show()

		// All processes in init will throw error if something goes fatally wrong
		// in which case we just don't save the show in this.shows
		try {
			await show.init(title)
		} catch (err) {
			//! Message to frontend
			console.error(
				'\x1b[31m',
				'Could not create show with title: ' + title,
				'\x1b[0m'
			)
			console.error(err)
			return
		}

		this.shows.push(show)
	}

	removeShow(imdbId) {
		const showIndex = this.shows.findIndex(show => show.imdbId === imdbId)
		this.shows.splice(showIndex, 1)
	}

	_showExists(title) {
		const match = this.shows.find(
			show => show.title.toLowerCase() === title.toLowerCase()
		)

		return match
	}
}

module.exports = Group
