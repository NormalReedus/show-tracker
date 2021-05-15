<template>
	<FlexboxLayout class="show-card" @tap="showModal" @doubleTap="cardDoubleTap">
		<Image
			:src="show.poster"
			loadMode="async"
			stretch="aspectFit"
			class="poster"
		/>
		<FlexboxLayout class="progress">
			<FlexboxLayout class="progress-item">
				<Label class="progress-item__label">SEASON</Label>
				<Label class="progress-item__number">{{
					show.lastWatched.seasonNum
				}}</Label>
			</FlexboxLayout>
			<FlexboxLayout class="progress-item">
				<Label class="progress-item__label">EPISODE</Label>
				<Label class="progress-item__number">{{
					show.lastWatched.episodeNum
				}}</Label>
			</FlexboxLayout>
		</FlexboxLayout>
		<!-- <Label v-if="show.nextAirDate" :text="`Next ep.: ${show.nextAirDate}`" />
		<Label :text="`Runtime: ${show.nextRuntime}`" />
		<Label :text="`Episodes left: ${show.episodesLeft}`" /> -->
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
		cardDoubleTap() {
			this.incrementEpisode()
		},
		incrementEpisode() {
			this.show.watchEpisode()
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

.progress {
	justify-content: space-around;
	width: 60%;
	margin-top: 5;

	&-item {
		flex-direction: column;
		align-items: center;

		&__label {
			font-size: 10;
			// font-family: sans-serif-condensed;
		}

		&__number {
			font-size: 30;
			margin-top: -10;
			font-weight: bold;
			// font
		}
	}
}
</style>
