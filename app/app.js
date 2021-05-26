import VueDevtools from 'nativescript-vue-devtools'
import Vue from 'nativescript-vue'
Vue.use(VueDevtools)
import store from './store'
import Home from './components/Home'
import RadListView from 'nativescript-ui-listview/vue'
Vue.use(RadListView)
import TabsPlugin from '@nativescript-community/ui-material-tabs/vue'
Vue.use(TabsPlugin)
import BottomNavigation from '@nativescript-community/ui-material-bottom-navigation/vue'
Vue.use(BottomNavigation)
import * as frameModule from '@nativescript/core/ui/frame'

const app = new Vue({
	render: h => h('frame', [h(Home)]),
	store,
})

// custom function to show modals from Vuex
Vue.showModal = function(component, options) {
	return new Promise(resolve => {
		let resolved = false
		const closeCb = function(data) {
			if (resolved) return

			resolved = true
			resolve(data)
			modalPage.closeModal()

			modalInstance.$destroy()
		}

		const opts = Object.assign({}, options, {
			context: null,
			closeCallback: closeCb,
		})

		const modalInstance = new Vue({
			name: 'ModalEntry',
			methods: {
				closeCb,
			},
			render: function(h) {
				return h(component, {
					props: opts.props,
				})
			},
		})
		const modalPage = modalInstance.$mount().$el.nativeView

		frameModule.topmost().showModal(modalPage, opts)
	})
}

app.$start()

store.dispatch('loadData')
