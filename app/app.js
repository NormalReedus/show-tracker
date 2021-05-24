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

store.dispatch('loadData')
