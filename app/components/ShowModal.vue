<template>
	<StackLayout>
		<GridLayout columns="auto, auto, 60" rows="30, auto, auto">
			<Image
				row="0"
				rowSpan="3"
				col="0"
				colSpan="3"
				:src="show.poster"
				loadMode="async"
				stretch="aspectFit"
				width="100%"
			/>
			<Label
				text=""
				class="favorite-modal"
				:class="show.favorite ? 'fas' : 'far'"
				row="1"
				col="2"
				@tap="toggleFavorite"
			/>
		</GridLayout>

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
		toggleFavorite() {
			this.show.toggleFavorite()
		},
		async removeShow() {
			const res = await confirm({
				title: 'Remove show?',
				message: 'Are you sure you want to remove this show?',
				okButtonText: 'Yup',
				cancelButtonText: 'Nah',
			})

			if (res) {
				// true tells parent to emit a removeShow event
				this.$modal.close(true)
			}
		},
		async setProgress() {
			const progress = await this.$showModal(ProgressListPicker, {
				props: {
					show: this.show,
				},
			})

			// set progress was canceled
			if (!progress) return

			// seas, ep
			this.show.setProgress(progress)
		},
	},
}
</script>

<style lang="scss" scoped>
.data-section {
	// taken from button styling
	padding: 16 16 0;

	.container + .container {
		margin-left: 10;
	}
}

.progress-container {
	justify-content: center;
	width: 50%;
}

.button {
	width: 100%;
}

.favorite-modal {
	top: 10%;
	left: 90%;

	font-size: 30;
	color: yellowgreen;

	text-shadow: 1 1 4 black;
}
</style>
