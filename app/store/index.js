import Vue from 'nativescript-vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const clipboard = require('nativescript-clipboard')
import { android } from '@nativescript/core/application'
import { setString, getString } from '@nativescript/core/application-settings'

import Group from '~/backend/Group'
import Show from '~/backend/Show'

import Alert from '@/components/dialogs/Alert'
import Confirm from '@/components/dialogs/Confirm'
import Prompt from '@/components/dialogs/Prompt'

const STORAGE_KEY = 'groups'

const store = new Vuex.Store({
	state: {
		groups: [],
	},

	mutations: {
		addGroup(state, group) {
			state.groups.push(group)
		},

		overwriteGroups(state, groups) {
			state.groups = groups
		},

		removeGroup(state, title) {
			const index = state.groups.findIndex(group => group.title === title)

			if (index === -1) return

			state.groups.splice(index, 1)
		},

		renameGroup(_, { group, title }) {
			group.title = title
		},
	},

	actions: {
		async newGroup({ dispatch, commit, state }) {
			const res = await Vue.showModal(Prompt, {
				props: {
					title: 'Create group',
					message: 'Choose a title for the group.',
					okButtonText: 'Create',
					cancelButtonText: 'Cancel',
					placeholderText: 'Group title',
				},
			})

			// canceled by user
			if (!res || !res.result) return

			if (res.text) {
				res.text = res.text.trim()
			}

			if (res.text === '') {
				Vue.showModal(Alert, {
					props: {
						title: 'Could not create group',
						message: 'A group cannot have an empty name.',
						okButtonText: 'Alright',
					},
				})

				return
			}

			// no duplicates - title is like an ID for deletion
			const titleExists = state.groups.findIndex(group => group.title.toLowerCase() === res.text.toLowerCase())

			// group name is taken
			if (titleExists !== -1) {
				Vue.showModal(Alert, {
					props: {
						title: 'Could not create group',
						message: `There is already a group with the title '${res.text}'.`,
						okButtonText: 'Alright',
					},
				})

				return
			}

			try {
				const group = new Group(res.text)
				commit('addGroup', group)

				restart()

				dispatch('saveData')
			} catch (err) {
				Vue.showModal(Alert, {
					props: {
						title: 'Could not create group',
						message: 'There was an error creating the group.',
						okButtonText: 'Alright',
					},
				})

				return
			}
		},

		async removeGroup({ dispatch, commit }, title) {
			const res = await Vue.showModal(Confirm, {
				props: {
					title: 'Remove group?',
					message: `Are you sure you want to remove the group '${title}'?`,
					okButtonText: 'Remove',
					cancelButtonText: 'Nah',
					danger: true,
				},
			})

			// canceled by user
			if (!res) return

			commit('removeGroup', title)

			restart()

			dispatch('saveData')
		},

		async renameGroup({ dispatch, commit }, group) {
			const res = await Vue.showModal(Prompt, {
				props: {
					title: 'Rename group',
					message: `Choose a new title for the group '${group.title}'.`,
					defaultText: group.title,
					okButtonText: 'Rename',
					cancelButtonText: 'Cancel',
					placeholderText: 'Group title',
				},
			})

			// canceled by user
			if (!res || !res.result) return

			if (res.text) {
				res.text = res.text.trim()
			}

			if (res.text === '') {
				Vue.showModal(Alert, {
					props: {
						title: 'Could not rename group',
						message: 'A group cannot have an empty name.',
						okButtonText: 'Alright',
					},
				})

				return
			}

			commit('renameGroup', { group, title: res.text })

			dispatch('saveData')
		},

		// does not commit since adding groups is async...
		async newShow({ dispatch }, group) {
			const res = await Vue.showModal(Prompt, {
				props: {
					title: 'New show',
					message: `Add a show to the group '${group.title}'.`,
					okButtonText: 'Create',
					cancelButtonText: 'Cancel',
					placeholderText: 'Show title',
				},
			})

			// cancelled by user
			if (!res || !res.result) return

			if (res.text) {
				res.text = res.text.trim()
			}

			if (group.showExists(res.text)) {
				Vue.showModal(Alert, {
					props: {
						title: 'Error',
						message: `The show: ${res.text} already exists in this group.`,
						okButtonText: 'Alright',
					},
				})
				return
			}

			const err = await group.addShow(res.text)

			if (err) {
				Vue.showModal(Alert, {
					props: {
						title: 'Error',
						message: err,
						okButtonText: 'Alright',
					},
				})
				return
			}

			dispatch('saveData')
		},

		removeShow({ dispatch }, { group, imdbId }) {
			group.removeShow(imdbId)

			dispatch('saveData')
		},

		setProgress({ dispatch }, { show, progress }) {
			show.setProgress(progress)

			dispatch('saveData')
		},

		incrementEpisode({ dispatch }, show) {
			show.watchEpisode()
			dispatch('saveData')
		},

		decrementEpisode({ dispatch }, show) {
			show.unwatchEpisode()
			dispatch('saveData')
		},

		toggleFavorite({ dispatch }, show) {
			show.toggleFavorite()
			dispatch('saveData')
		},

		async exportGroups({ state }) {
			try {
				await clipboard.setText(JSON.stringify(state.groups))
			} catch (err) {
				Vue.showModal(Alert, {
					props: {
						title: 'Error',
						message: 'There was an error exporting groups',
						okButtonText: 'Alright',
					},
				})
				console.error(err)
				return
			}

			Vue.showModal(Alert, {
				props: {
					title: 'Export groups',
					message: 'Your groups have been copied to the clipboard.',
					okButtonText: 'Alright',
				},
			})
		},

		async importGroups({ dispatch, commit }) {
			let clipboardContent
			let groups

			try {
				clipboardContent = await clipboard.getText()

				// generate groups and shows (with methods etc) from static json
				groups = Group.importGroups(clipboardContent)
			} catch (err) {
				Vue.showModal(Alert, {
					props: {
						title: 'Error',
						message: 'There was an error importing groups. Make sure you have the exported groups in your clipboard.',
						okButtonText: 'Alright',
					},
				})
				console.error(err)
				return
			}

			const res = await Vue.showModal(Confirm, {
				props: {
					title: 'Overwrite groups?',
					message: 'Would you like to overwrite existing groups or append groups to the already existing groups?',
					okButtonText: 'Overwrite',
					cancelButtonText: 'Append',
					danger: true,
				},
			})

			if (res) {
				// overwrite
				commit('overwriteGroups', groups)
			} else {
				// append
				for (const group of groups) {
					commit('addGroup', group)
				}
			}

			restart()

			dispatch('saveData')
			// saving is also done when updating completes to make sure we at least have the right shows saved
			// and hopefully also have them updated
			dispatch('updateShows')
		},

		// fetch new seasons, data about next episode airdate etc
		async updateShows({ state }) {
			const promises = []

			for (const group of state.groups) {
				for (const show of group.shows) {
					try {
						promises.push(show.update())
					} catch (err) {
						console.log('Cannot update show')
						console.log(err)
					}
				}
			}

			// waiting for all updates to finish before saving to storage
			await Promise.all(promises)

			dispatch('saveData')
		},

		// take everything in state.groups and save to appplication-settings as json
		async saveData({ state }) {
			const data = JSON.stringify(state.groups)

			setString(STORAGE_KEY, data)
		},

		// take json from application-settings and load like when importing groups (with overwrite)
		loadData({ commit }) {
			// return null if there is nothing in application-settings
			const jsonData = getString(STORAGE_KEY, null)
			if (!jsonData) return

			// generate groups and shows (with methods etc) from static json
			const groups = Group.importGroups(jsonData)

			commit('overwriteGroups', groups)
		},
	},
})

// keep show data updated
setInterval(() => {
	store.dispatch('updateShows')
}, hrsToMs(Show.UPDATE_INTERVAL_HOURS))

function hrsToMs(hrs) {
	return hrs * 60 * 60 * 1000
}

function restart() {
	const activity = android.foregroundActivity
	const intent = activity.getIntent()

	activity.finish()
	android.context.startActivity(intent)
}

export default store
