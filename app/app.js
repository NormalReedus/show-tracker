import VueDevtools from 'nativescript-vue-devtools'
import Vue from 'nativescript-vue'
Vue.use(VueDevtools)
import store from './store'
import Home from './components/Home'
import RadListView from 'nativescript-ui-listview/vue'
Vue.use(RadListView)
import TabsPlugin from '@nativescript-community/ui-material-tabs/vue'
Vue.use(TabsPlugin)

// import Group from '@/backend/Group' //! DELETE

new Vue({
	render: h => h('frame', [h(Home)]),
	store,
}).$start()

store.dispatch('loadData')
// DEMO SHOWS
// ;(async () => {
// 	const group1 = new Group('Helena')
// 	const group2 = new Group('Magnus')

// 	const shows1 = [
// 		'game of thrones',
// 		'the walking dead',
// 		'the flash',
// 		'better call saul',
// 		'rick and morty',
// 		'lovecraft country',
// 	]

// 	const shows2 = ['band of brothers', 'the pacific']

// 	for (const show of shows1) {
// 		group1.addShow(show)
// 	}
// 	for (const show of shows2) {
// 		group2.addShow(show)
// 	}

// 	store.commit('addGroup', group1)
// 	store.commit('addGroup', group2)
// })()
