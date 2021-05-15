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
		<StackLayout class="data-container">
			<Label
				:text="
					`S: ${show.lastWatched.seasonNum} E: ${show.lastWatched.episodeNum}`
				"
			/>
			<Label v-if="show.nextAirDate" :text="`Next ep.: ${show.nextAirDate}`" />
			<Label :text="`Runtime: ${show.nextRuntime}`" />
			<Label :text="`Episodes left: ${show.episodesLeft}`" />
			<!-- <ListPicker
				:items="this.show.seasonNums"
				:selectedIndex="this.show.lastWatched.seasonNum"
			></ListPicker> -->

			<!-- number spinner til sæs og ep, + og - til episoder (lav knap der åbner modal), favorite i hjørnet af billede, slet show-knap  -->
		</StackLayout>
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

<style lang="scss" scoped>
.data-container {
	padding: 25;
}
</style>
