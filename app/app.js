import VueDevtools from 'nativescript-vue-devtools'
import Vue from 'nativescript-vue'
import Vuex from 'vuex'
Vue.use(VueDevtools)
import store from './store'
import Home from './components/Home'

new Vue({
	render: h => h('frame', [h(Home)]),
	store,
}).$start()
