<template>
	<FlexboxLayout class="progress">
		<FlexboxLayout class="progress-item">
			<Label class="progress-item__label h6 text-uppercase">Season</Label>
			<Label class="progress-item__number h1">{{ lastWatched.seasonNum }}</Label>
		</FlexboxLayout>
		<FlexboxLayout class="progress-item">
			<Label class="progress-item__label h6 text-uppercase">Episode</Label>
			<Label class="progress-item__number h1">{{ lastWatched.episodeNum }}</Label>
		</FlexboxLayout>
	</FlexboxLayout>
</template>

<script>
export default {
	props: {
		lastWatched: {
			type: Object,
			required: true,
		},
	},
}
</script>

<style lang="scss" scoped>
.progress {
	justify-content: space-around;

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
