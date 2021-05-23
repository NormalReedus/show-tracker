<template>
	<FlexboxLayout class="listpicker-wrapper">
		<FlexboxLayout justifyContent="space-around" class="listpicker-container">
			<FlexboxLayout flexDirection="column" alignItems="center">
				<Label class="text-uppercase h3">Season</Label>
				<!-- v-model uses index, not the items from show.seasonNums -->
				<ListPicker :items="show.seasonNums" :selectedIndex="seas - 1" @selectedIndexChange="seas = $event.value + 1" />
			</FlexboxLayout>
			<FlexboxLayout flexDirection="column" alignItems="center">
				<Label class="text-uppercase h3">Episode</Label>
				<ListPicker :items="selectableEpisodes" v-model="ep" />
			</FlexboxLayout>
		</FlexboxLayout>
		<ButtonWrapper>
			<Button col="0" row="0" @tap="closeModal(true)" class="button -primary">Save</Button>
			<Button col="2" row="0" @tap="closeModal(false)" class="button">Cancel</Button>
		</ButtonWrapper>
	</FlexboxLayout>
</template>

<script>
import ButtonWrapper from '@/components/ButtonWrapper'

//! Make changing lastwatched use an action that calls saveData
// TODO: tilføj mulighed for enten at vælge sidste ep i en sæson eller hele sæson, for at signalere en hel sæson er set
export default {
	components: {
		ButtonWrapper,
	},

	props: {
		show: {
			type: Object,
			required: true,
		},
	},

	data: () => ({
		seas: 1,
		ep: 0,
	}),

	computed: {
		items() {
			// the getter for is just pluralized from the property
			// this.show.lastWatched.seasonNum => this.show.seasonNums, and the same for episodeNum(s)
			return this.show[this.property + 's']
		},

		selectableEpisodes() {
			return this.show.getSeasonEpisodeNums(this.seas)
		},
	},

	methods: {
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
ListPicker {
	height: 120;
	width: 60;
}
.listpicker-wrapper {
	justify-content: center;
	flex-direction: column;
}

.listpicker-container {
	padding: 16 16 0;
}

.button {
	width: 100%;
}
</style>
