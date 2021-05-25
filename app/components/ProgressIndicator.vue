<template>
	<FlexboxLayout class="progress">
		<FlexboxLayout class="progress-item">
			<Label class="progress-item__label h6 text-uppercase text-default">Season</Label>
			<Label class="progress-item__number h1 text-default">{{ lastWatched.seasonNum }}</Label>
		</FlexboxLayout>
		<FlexboxLayout class="progress-item">
			<Label class="progress-item__label h6 text-uppercase text-default">Episode</Label>
			<Label class="progress-item__number h1 text-default">{{ lastWatched.episodeNum }}</Label>
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
