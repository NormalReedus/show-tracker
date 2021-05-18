<template>
	<FlexboxLayout class="data-container">
		<Label class="text-center h6 label text-uppercase" v-if="show.nextAirDate" text="Next episode" />
		<Label class="text-center h3" v-if="show.nextAirDate" :text="show.nextAirDate" />
		<Label class="text-center h6 label text-uppercase" text="Runtime" />
		<Label class="text-center h3" :text="show.nextRuntime" />
		<Label class="text-center h6 label text-uppercase" text="Episodes left" />
		<Label class="text-center h3" :text="show.episodesLeft" />
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
}
</script>

<style lang="scss" scoped>
.data-container {
	flex-direction: column;
	width: 50%;
}

.label {
	margin-bottom: 0;
}
</style>
