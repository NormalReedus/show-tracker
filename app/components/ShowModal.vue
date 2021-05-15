<template>
	<StackLayout>
		<Image
			:src="show.poster"
			loadMode="async"
			stretch="aspectFit"
			class="bg-image"
		/>
		<StackLayout class="data-container" orientation="horizontal">
			<StackLayout>
				<Label
					:text="
						`S: ${show.lastWatched.seasonNum} E: ${show.lastWatched.episodeNum}`
					"
				/>
				<Label
					v-if="show.nextAirDate"
					:text="`Next ep.: ${show.nextAirDate}`"
				/>
				<Label :text="`Runtime: ${show.nextRuntime}`" />
				<Label :text="`Episodes left: ${show.episodesLeft}`" />

				<!-- number spinner til sæs og ep, + og - til episoder (lav knap der åbner modal), favorite i hjørnet af billede, slet show-knap  -->
			</StackLayout>
			<StackLayout width="100%">
				<Button @tap="setProgress">Set progress</Button>
			</StackLayout>
		</StackLayout>
	</StackLayout>
</template>

<script>
//TODO: display Show details as well as controls / inputs
//TODO: use this.$showModal with passed props in Home to show this modal
import ProgressListPicker from '@/components/ProgressListPicker'
export default {
	props: {
		show: {
			type: Object,
			required: true,
		},
	},

	methods: {
		async setProgress() {
			const progress = await this.$showModal(ProgressListPicker, {
				props: {
					show: this.show,
				},
			})

			// Set progress was canceled
			if (!progress) return

			// seas, ep
			this.show.setProgress(progress)
		},
	},
}
</script>

<style lang="scss" scoped>
.data-container {
	padding: 25;
}
</style>
