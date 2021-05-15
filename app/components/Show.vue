<template>
	<FlexboxLayout class="show-card" @tap="showModal" @doubleTap="incrementEpisode" @longPress="decrementEpisode">
		<Image :src="show.poster" loadMode="async" stretch="aspectFit" class="poster" />
		<ProgressIndicator :lastWatched="show.lastWatched" marginTop="5" width="60%" />
	</FlexboxLayout>
</template>

<script>
import ShowModal from '@/components/ShowModal'
import ProgressIndicator from '@/components/ProgressIndicator'

export default {
	components: {
		ProgressIndicator,
	},
	props: {
		show: {
			type: Object,
			required: true,
		},
	},

	methods: {
		incrementEpisode() {
			this.show.watchEpisode()
		},
		decrementEpisode() {
			this.show.unwatchEpisode()
		},
		showModal() {
			this.$showModal(ShowModal, {
				// fullscreen: true,
				stretched: true,
				props: {
					show: this.show,
				},
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.show-card {
	flex-direction: column;
	width: 50%;
	height: 250;
	align-items: center;
	margin-top: 10;
}
.poster {
	height: 70%;
}
</style>
