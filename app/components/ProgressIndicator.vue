<template>
	<FlexboxLayout class="progress">
		<FlexboxLayout class="progress-item">
			<Label class="progress-item__label h6 text-uppercase text-default">Season</Label>
			<Label class="progress-item__number h1 text-default">{{ progress.seasonNum }}</Label>
		</FlexboxLayout>
		<FlexboxLayout class="progress-item">
			<Label class="progress-item__label h6 text-uppercase text-default">Episode</Label>
			<Label class="progress-item__number h1 text-default">{{ displayEpisodeNum }}</Label>
		</FlexboxLayout>
	</FlexboxLayout>
</template>

<script>
export default {
	props: {
		show: {
			type: Object,
			required: true,
		},
	},

	computed: {
		progress() {
			return this.show.progress
		},

		displayEpisodeNum() {
			if (this.progress.episodeNum === this.show.currentSeason.Episodes.length) return '—'

			return this.progress.episodeNum
		},
	},
}
</script>

<style lang="scss" scoped>
.progress {
	&-item {
		flex-direction: column;
		align-items: center;

		&__number {
			margin-top: -10;
			font-weight: bold;
		}
	}
}
</style>
