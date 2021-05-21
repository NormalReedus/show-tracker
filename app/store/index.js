import Vue from 'nativescript-vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const clipboard = require('nativescript-clipboard')
import { android } from '@nativescript/core/application'

import Group from '~/backend/Group'

const store = new Vuex.Store({
	state: {
		groups: [],
	},
	mutations: {
		addGroup(state, group) {
			state.groups.push(group)

			//! Save state in storage?
		},

		overwriteGroups(state, groups) {
			state.groups = groups

			//! Save state in storage?
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
		// only an action because it can return the group
		//! remove if the return value is not needed out of testing, and use mutation directly
		newGroup({ commit, state }, title) {
			// No duplicates - title is like an ID for deletion
			const titleExists = state.groups.findIndex(group => group.title === title)

			if (titleExists !== -1) {
				alert({
					title: 'Could not create group',
					message: `There is already a group with the title '${title}'.`,
					okButtonText: 'Alright',
				})

				return
			}

			const group = new Group(title)

			commit('addGroup', group)

			return group
		},

		async removeGroup({ commit }, title) {
			const res = await confirm({
				title: 'Remove group?',
				message: `Are you sure you want to remove the group '${title}'? This will restart the application.`,
				okButtonText: 'Yup',
				cancelButtonText: 'Nah',
			})

			if (res) {
				commit('removeGroup', title)
				// Save shit

				restart()
			}
		},

		async renameGroup({ commit }, group) {
			const res = await prompt({
				title: 'Rename group',
				message: `Choose a new title for the group '${group.title}'.`,
				defaultText: group.title,
				okButtonText: 'Done',
				cancelButtonText: 'Take me back',
			})

			if (res.result) {
				commit('renameGroup', { group, title: res.text })
				// Save shit
			}
		},

		// does not commit since adding groups is async...
		async newShow(_, group) {
			const res = await prompt({
				title: 'New show',
				message: `Add a show to the group '${group.title}'.`,
				okButtonText: 'Done',
				cancelButtonText: 'Take me back',
			})

			if (res.result) {
				if (group.showExists(res.text)) {
					alert({
						title: 'Error',
						message: `The show: ${res.text} already exists in this group.`,
						okButtonText: 'Alright',
					})
					return
				}

				const err = await group.addShow(res.text)

				if (err) {
					alert({
						title: 'Error',
						message: err,
						okButtonText: 'Alright',
					})
					return
				}

				return group
			}
		},

		async exportShows({ state }) {
			try {
				await clipboard.setText(JSON.stringify(state.groups))
			} catch (err) {
				alert({
					title: 'Error',
					message: 'There was an error exporting shows',
					okButtonText: 'Alright',
				})
				console.error(err)
				return
			}

			alert({
				title: 'Export shows',
				message: 'Your data has been copied to the clipboard.',
				okButtonText: 'Yup',
			})
		},

		async importShows({ commit, dispatch }) {
			let clipboardContent
			let groups

			try {
				clipboardContent = await clipboard.getText()

				// generate groups and shows (with methods etc) from static json
				groups = Group.importGroups(clipboardContent)
			} catch (err) {
				alert({
					title: 'Error',
					message: 'There was an error importing shows. Make sure you have the exported shows in your clipboard.',
					okButtonText: 'Alright',
				})
				console.error(err)
				return
			}

			const res = await confirm({
				title: 'Overwrite groups?',
				message: 'Would you like to overwrite existing groups or append groups to the already existing groups?',
				okButtonText: 'Overwrite',
				cancelButtonText: 'Append',
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

			await alert({
				title: 'Import shows',
				message: 'Your shows have been imported. The app will now restart.',
				okButtonText: 'Awesome',
			})

			restart()

			dispatch('updateShows')
		},

		// fetch new seasons, data about next episode airdate etc
		updateShows({ state }) {
			for (const group of state.groups) {
				for (const show of group.shows) {
					show.update()
				}
			}
		},
	},
})

function restart() {
	const activity = android.foregroundActivity
	const intent = activity.getIntent()

	activity.finish()
	android.context.startActivity(intent)
}

export default store
