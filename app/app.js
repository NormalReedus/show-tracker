import VueDevtools from 'nativescript-vue-devtools'
import Vue from 'nativescript-vue'

Vue.use(VueDevtools)

import Home from './components/Home'

new Vue({
	render: h => h('frame', [h(Home)]),
}).$start()
