<template>
	<FlexboxLayout class="data-container">
		<Label class="text-center h6 label text-uppercase text-default" v-if="show.nextAirDate" text="Next episode" />
		<Label class="text-center h3 text-default" v-if="show.nextAirDate" :text="show.nextAirDate" />
		<Label class="text-center h6 label text-uppercase text-default" v-if="show.nextRuntime" text="Runtime" />
		<Label class="text-center h3 text-default" v-if="show.nextRuntime" :text="show.nextRuntime" />
		<Label class="text-center h6 label text-uppercase text-default" text="Episodes left" />
		<Label class="text-center h3 text-default" :text="show.episodesLeft" />
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
