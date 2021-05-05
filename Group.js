const Show = require('./Show')

class Group {
  constructor(title) {
    this.title = title
    this.shows = []
  }

  async addShow(title) {
    // Shows are sync, but initializes async
    if (this.#showExists(title)) {
      //! Display in frontend
      console.log('This show already exists in this group')
      return
    }

    const show = new Show()
    //! Check if init goes right (make it return something) and delete this object from category again if it's shit
    await show.init(title)

    this.shows.push(show)
  }

  removeShow(imdbId) {
    const showIndex = this.shows.findIndex((show) => show.imdbId === imdbId)
    this.shows.splice(showIndex, 1)
  }

  #showExists(title) {
    const match = this.shows.find(
      (show) => show.title.toLowerCase() === title.toLowerCase()
    )

    return match
  }
}

module.exports = Group
