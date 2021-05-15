<template>
	<StackLayout>
		<Image
			:src="show.poster"
			loadMode="async"
			stretch="aspectFit"
			class="bg-image"
		/>
		<Label
			marginTop="-100"
			height="100"
			background="linear-gradient(to bottom, transparent, black)"
		/>
		<!-- sæt farve der matcher baggrund -->

		<Label
			:text="
				`S: ${show.lastWatched.seasonNum} E: ${show.lastWatched.episodeNum}`
			"
		/>
		<Label v-if="show.nextAirDate" :text="`Next ep.: ${show.nextAirDate}`" />
		<Label :text="`Runtime: ${show.nextRuntime}`" />
		<Label :text="`Episodes left: ${show.episodesLeft}`" />
	</StackLayout>
</template>

<script>
//TODO: display Show details as well as controls / inputs
//TODO: use this.$showModal with passed props in Home to show this modal
export default {
	props: {
		show: {
			type: Object,
			required: true,
		},
	},
}
</script>

<style lang="scss" scoped></style>
