<template>
	<FlexboxLayout class="show-card">
		<GridLayout
			columns="auto, auto, 30"
			rows="10, auto, auto"
			@tap="showModal"
			@doubleTap="incrementEpisode"
			@longPress="decrementEpisode"
		>
			<Image
				row="0"
				rowSpan="3"
				col="0"
				colSpan="3"
				:src="show.poster"
				loadMode="async"
				stretch="aspectFit"
				class="poster"
			/>
			<!-- star icon -->
			<Label v-if="show.favorite" row="1" col="2" text="" class="favorite-card fas" />
		</GridLayout>
		<ProgressIndicator :lastWatched="show.lastWatched" class="progress-indicator" />
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
			this.$store.dispatch('incrementEpisode', this.show)
		},
		decrementEpisode() {
			this.$store.dispatch('decrementEpisode', this.show)
		},
		async showModal() {
			const removeShow = await this.$showModal(ShowModal, {
				stretched: true,
				props: {
					show: this.show,
				},
			})

			if (removeShow) {
				this.$emit('removeShow', this.show.imdbId)
			}
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
}
.poster {
	height: 70%;
}
.favorite-card {
	top: 10%;
	left: 90%;

	font-size: 18;
	color: yellowgreen;

	text-shadow: 2 2 6 black;
}

.progress-indicator {
	margin-top: 5;
	width: 60%;
	justify-content: space-around;
}
</style>
