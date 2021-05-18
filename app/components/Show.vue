<template>
	<FlexboxLayout class="show-card" @tap="showModal" @doubleTap="incrementEpisode" @longPress="decrementEpisode">
		<GridLayout columns="auto, auto, 30" rows="10, auto, auto">
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
			<Label v-if="show.favorite" row="1" col="2" text="" class="favorite-card fas" />
		</GridLayout>
		<ProgressIndicator :lastWatched="show.lastWatched" marginTop="5" width="60%" justifyContent="space-around" />
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
	margin-top: 10;
}
.poster {
	height: 70%;
}
.favorite-card {
	top: 10%;
	left: 90%;

	font-size: 18;
	color: yellowgreen;

	text-shadow: 1 1 4 black;
}
</style>
