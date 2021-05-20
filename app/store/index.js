import Vue from 'nativescript-vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const clipboard = require('nativescript-clipboard')

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

		removeGroup(state, index) {
			state.groups.splice(index, 1)
		},

		renameGroup(_, { group, title }) {
			group.title = title
		},

		// addShow(state) {
		// 	console.log('Added the show, mate')
		// },
	},

	actions: {
		// Only an action because it can return the group
		//! Return if the return value is not needed out of testing, and use mutation directly
		newGroup({ commit }, title) {
			const group = new Group(title)

			commit('addGroup', group)

			return group
		},

		async removeGroup({ commit }, { group, i }) {
			const res = await confirm({
				title: 'Remove group?',
				message: `Are you sure you want to remove the group '${group.title}'?`,
				okButtonText: 'Yup',
				cancelButtonText: 'Nah',
			})

			if (res) {
				commit('removeGroup', i)
			}
		},

		async newShow(_, { group, title }) {
			const err = await group.addShow(title)

			if (err) {
				alert({
					title: 'Error',
					message: 'There was an error when adding the show: ' + title,
					okButtonText: 'Alright',
				})
				return
			}

			return group
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
				title: 'Export',
				message: 'Your data has been copied to the clipboard.',
				okButtonText: 'Yup',
			})
		},

		//! Buggy until going through all tabs
		async importShows({ commit }) {
			let clipboardContent

			try {
				clipboardContent = await clipboard.getText()
			} catch (err) {
				alert({
					title: 'Error',
					message: 'There was an error importing shows. Make sure you have the exported shows in your clipboard.',
					okButtonText: 'Alright',
				})
				console.error(err)
				return
			}

			// Generate groups and shows (with methods etc) from static json
			const groups = Group.importGroups(clipboardContent)

			const res = await confirm({
				title: 'Overwrite groups?',
				message:
					"Do you want to overwrite all existing groups & shows? Select 'nah' to instead add groups & shows to the existing groups & shows.",
				okButtonText: 'Yup',
				cancelButtonText: 'Nah',
			})

			if (res) {
				commit('overwriteGroups', groups)
			} else {
				for (const group of groups) {
					commit('addGroup', group)
				}
			}

			//! Update all shows
			alert({
				title: 'Import',
				message: 'Your shows have been imported.',
				okButtonText: 'Awesome',
			})
		},
	},
})

export default store
