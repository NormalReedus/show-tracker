import VueDevtools from 'nativescript-vue-devtools'
import Vue from 'nativescript-vue'
Vue.use(VueDevtools)
import store from './store'
import Home from './components/Home'
import RadListView from 'nativescript-ui-listview/vue'
Vue.use(RadListView)
import TabsPlugin from '@nativescript-community/ui-material-tabs/vue'
Vue.use(TabsPlugin)

new Vue({
	render: h => h('frame', [h(Home)]),
	store,
}).$start()

// DEMO SHOWS
;(async () => {
	const group1 = await store.dispatch('newGroup', 'Helena')
	const group2 = await store.dispatch('newGroup', 'Magnus')

	const shows1 = [
		'game of thrones',
		'the walking dead',
		'the flash',
		'better call saul',
		'rick and morty',
		'lovecraft country',
	]

	const shows2 = ['band of brothers', 'the pacific']

	if (group1) {
		for (const show of shows1) {
			store.dispatch('newShow', { group: group1, title: show })
		}
	}

	if (group2) {
		for (const show of shows2) {
			store.dispatch('newShow', { group: group2, title: show })
		}
	}
})()
