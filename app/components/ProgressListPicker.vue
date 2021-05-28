<template>
	<FlexboxLayout class="listpicker-wrapper">
		<FlexboxLayout justifyContent="space-around" class="listpicker-container bg-default text-default">
			<FlexboxLayout flexDirection="column" alignItems="center">
				<Label class="text-uppercase h3 text-default">Season</Label>
				<!-- v-model uses index, not the items from show.seasonNums -->
				<ListPicker :items="show.seasonNums" :selectedIndex="seas - 1" @selectedIndexChange="seas = $event.value + 1" />
			</FlexboxLayout>
			<FlexboxLayout flexDirection="column" alignItems="center">
				<Label class="text-uppercase h3 text-default">Episode</Label>
				<ListPicker :items="selectableEpisodes" v-model="epHandler" />
			</FlexboxLayout>
		</FlexboxLayout>
		<ButtonWrapper class="bg-default">
			<Button col="0" row="0" @tap="closeModal(false)" class="button bg-alt">Cancel</Button>
			<Button col="2" row="0" @tap="closeModal(true)" class="button text-accent-contrast bg-accent">Save</Button>
		</ButtonWrapper>
	</FlexboxLayout>
</template>

<script>
//! episode should "v-model" like seasons do, since episodes are now also 1 indexed
//! but both will need to have a custom handler for seas / ep of 0, since that should not be + 1
// this could be done in getters and setters

import ButtonWrapper from '@/components/ButtonWrapper'

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
		//! {check} if needed when new season / ep system is implemented
		epHandler: {
			get() {
				return this.ep
			},
			set(episodeNum) {
				// can't go below 0
				episodeNum = Math.max(0, episodeNum)

				this.ep = episodeNum
			},
		},

		items() {
			// the getter for is just pluralized from the property
			// this.show.progress.seasonNum => this.show.seasonNums, and the same for episodeNum(s)
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

			// handled in ShowModal
			this.$modal.close({
				seas: this.seas,
				ep: this.ep,
			})
		},
	},

	created() {
		this.seas = this.show.progress.seasonNum
		this.ep = this.show.progress.episodeNum
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
</style>
