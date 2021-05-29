<template>
	<FlexboxLayout class="listpicker-wrapper">
		<FlexboxLayout justifyContent="space-around" class="listpicker-container bg-default text-default">
			<FlexboxLayout flexDirection="column" alignItems="center">
				<Label class="text-uppercase h3 text-default">Season</Label>
				<!-- seasons are 0 indexed because of the special season 0, which coincidentally makes indices match values, not special handler needed -->
				<ListPicker :items="show.seasonNums" v-model="seas" />
			</FlexboxLayout>
			<FlexboxLayout flexDirection="column" alignItems="center">
				<Label class="text-uppercase h3 text-default">Episode</Label>
				<!-- v-model uses index, not values, so this uses a special handler to convert -->
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
		seas: 0, // 0-indexed
		ep: 0, // 1-indexed
	}),

	computed: {
		// episodes need custom handling
		epHandler: {
			get() {
				if (this.ep === 0) return 0

				// since ep is 1 indexed, and the picker v-models on index, we subtract one
				return this.ep - 1
			},

			set(listIndex) {
				if (this.seas === 0) {
					// if s is 0, all changes should set ep to 0 as well (although it should not be possible to change ep in this case)
					this.ep = 0
					return
				}

				// since eps are 1-indexed and this picker's v-model returns index
				// of selected value, we need to add 1
				this.ep = listIndex + 1
			},
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
