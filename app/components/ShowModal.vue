<template>
	<StackLayout>
		<Image :src="show.poster" loadMode="async" stretch="aspectFit" />

		<FlexboxLayout class="data-section" width="100%">
			<FlexboxLayout class="progress-container container">
				<ProgressIndicator :lastWatched="show.lastWatched" width="100%" flexDirection="column" />
			</FlexboxLayout>
			<MiscData class="container" :show="show" />
		</FlexboxLayout>
		<ButtonWrapper>
			<Button col="0" row="0" @tap="setProgress" class="button -primary">Set progress</Button>
			<Button col="2" row="0" class="button" @tap="removeShow">Remove show</Button>
		</ButtonWrapper>
	</StackLayout>
</template>

<script>
import ProgressListPicker from '@/components/ProgressListPicker'
import ProgressIndicator from '@/components/ProgressIndicator'
import ButtonWrapper from '@/components/ButtonWrapper'
import MiscData from '@/components/ShowMiscData'

export default {
	components: {
		ProgressIndicator,
		ButtonWrapper,
		MiscData,
	},

	props: {
		show: {
			type: Object,
			required: true,
		},
	},

	methods: {
		async removeShow() {
			const res = await confirm({
				title: 'Remove show',
				message: 'Are you sure you want to remove this show?',
				okButtonText: 'Yes',
				cancelButtonText: 'No',
			})

			if (res) {
				// True tells parent to emit a removeShow event
				this.$modal.close(true)
			}
		},
		async setProgress() {
			const progress = await this.$showModal(ProgressListPicker, {
				props: {
					show: this.show,
				},
			})

			// Set progress was canceled
			if (!progress) return

			// seas, ep
			this.show.setProgress(progress)
		},
	},
}
</script>

<style lang="scss" scoped>
.data-section {
	// Taken from button styling
	padding: 16 16 0;

	.container + .container {
		margin-left: 10;
	}
}

.progress-container {
	justify-content: center;
	width: 50%;
}

// .data-container {
// 	flex-direction: column;
// 	width: 50%;
// }

.button {
	width: 100%;
}
</style>
