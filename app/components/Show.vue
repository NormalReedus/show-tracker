<template>
	<FlexboxLayout
		flexDirection="column"
		width="50%"
		height="300"
		alignItems="center"
		marginTop="10"
		@tap="showModal"
	>
		<Image
			:src="show.poster"
			loadMode="async"
			stretch="aspectFit"
			height="70%"
		/>
		<Label
			:text="
				`S: ${show.lastWatched.seasonNum} E: ${show.lastWatched.episodeNum}`
			"
		/>
		<Label v-if="show.nextAirDate" :text="`Next ep.: ${show.nextAirDate}`" />
		<Label :text="`Runtime: ${show.nextRuntime}`" />
		<Label :text="`Episodes left: ${show.episodesLeft}`" />
	</FlexboxLayout>
</template>

<script>
import ShowModal from '@/components/ShowModal'
export default {
	props: {
		show: {
			type: Object,
			required: true,
		},
	},

	methods: {
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

<style lang="scss" scoped></style>
