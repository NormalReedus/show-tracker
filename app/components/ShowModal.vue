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

		<FlexboxLayout class="data-section bg-default" width="100%">
			<FlexboxLayout class="progress-container container">
				<ProgressIndicator :lastWatched="show.lastWatched" class="modal-progress-indicator" />
			</FlexboxLayout>
			<MiscData class="container" :show="show" />
		</FlexboxLayout>
		<ButtonWrapper class="bg-default">
			<Button col="0" row="0" @tap="setProgress" class="button -primary bg-accent">Set progress</Button>
			<Button col="2" row="0" class="button bg-danger" @tap="removeShow">Remove show</Button>
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
			this.$store.dispatch('toggleFavorite', this.show)
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

			// progress == { seas, ep }
			this.$store.dispatch('setProgress', { show: this.show, progress })
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

.modal-progress-indicator {
	width: 100%;
	flex-direction: column;
}

.button {
	width: 100%;
}
.favorite-modal {
	top: 10%;
	left: 90%;

	font-size: 30;
	color: yellowgreen;

	text-shadow: 2 2 6 black;
}
</style>
