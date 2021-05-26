const Core = require('@nativescript/core')

export default {
	props: {
		title: {
			type: String,
			required: true,
		},
		message: {
			type: String,
			required: false,
		},
		okButtonText: {
			type: String,
			required: false,
		},
		cancelButtonText: {
			type: String,
			required: false,
		},
	},
	computed: {
		themeMode() {
			return Core.Application.systemAppearance()
		},
	},
	methods: {
		close(res) {
			this.$modal.close(res)
		},
	},
}
