<template>
	<StackLayout>
		<Image :src="show.poster" loadMode="async" stretch="aspectFit" />

		<FlexboxLayout class="data-section" width="100%">
			<FlexboxLayout class="progress-container container">
				<ProgressIndicator :lastWatched="show.lastWatched" width="100%" />
			</FlexboxLayout>
			<FlexboxLayout class="data-container container">
				<Label class="text-center" v-if="show.nextAirDate" :text="`Next ep.: ${show.nextAirDate}`" />
				<Label class="text-center" :text="`Runtime: ${show.nextRuntime}`" />
				<Label class="text-center" :text="`Episodes left: ${show.episodesLeft}`" />

				<!-- number spinner til sæs og ep, + og - til episoder (lav knap der åbner modal), favorite i hjørnet af billede, slet show-knap  -->
			</FlexboxLayout>
		</FlexboxLayout>
		<ButtonWrapper>
			<Button col="0" row="0" @tap="setProgress" class="button -primary">Set progress</Button>
			<Button col="2" row="0" class="button">Remove show</Button>
		</ButtonWrapper>
	</StackLayout>
</template>

<script>
//TODO: display Show details as well as controls / inputs
//TODO: use this.$showModal with passed props in Home to show this modal
import ProgressListPicker from '@/components/ProgressListPicker'
import ProgressIndicator from '@/components/ProgressIndicator'
import ButtonWrapper from '@/components/ButtonWrapper'

export default {
	components: {
		ProgressIndicator,
		ButtonWrapper,
	},

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
.data-section {
	// Taken from button styling
	padding: 16 16 0;
	.container + .container {
		margin-left: 10;
	}
}

.progress-container {
	justify-content: center;
	width: 50%;
}

.data-container {
	flex-direction: column;
	width: 50%;
}

.button {
	width: 100%;
}
</style>
