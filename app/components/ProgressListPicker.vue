<template>
	<FlexboxLayout class="listpicker-container">
		<Label>Select a season</Label>
		<ListPicker :items="show.seasonNums" v-model="seas" />
		<Label>Select an episode</Label>
		<ListPicker :items="selectableEpisodes" v-model="ep" />
		<Button @tap="closeModal(true)">OK</Button>
		<Button @tap="closeModal(false)">Cancel</Button>
	</FlexboxLayout>
</template>

<script>
// TODO: tilføj mulighed for enten at vælge sidste ep i en sæson eller hele sæson, for at signalere en hel sæson er set
export default {
	props: {
		show: {
			type: Object,
			required: true,
		},
	},

	data: () => ({
		seas: 0,
		ep: 0,
	}),

	computed: {
		items() {
			// The getter for is just pluralized from the property
			// this.show.lastWatched.seasonNum => this.show.seasonNums, and the same for episodeNum(s)
			return this.show[this.property + 's']
		},

		selectableEpisodes() {
			return this.show.getSeasonEpisodeNums(this.seas)
		},
	},

	methods: {
		seasonChange(e) {
			console.log(e)
		},

		episodeChange(e) {
			console.log(e)
		},

		closeModal(success) {
			if (!success) {
				this.$modal.close(null)
				return
			}

			this.$modal.close({
				seas: this.seas,
				ep: this.ep,
			})
		},
	},

	created() {
		this.seas = this.show.lastWatched.seasonNum
		this.ep = this.show.lastWatched.episodeNum
	},
}
</script>

<style lang="scss" scoped>
.listpicker-container {
	justify-content: center;
	padding: 25;
	flex-direction: column;
}
</style>
