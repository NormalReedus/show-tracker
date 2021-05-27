<template>
	<StackLayout :class="{ 'ns-light': themeMode === 'light' }" class="modal bg-default">
		<StackLayout class="modal-text">
			<Label textWrap="true" class="h2 title text-default">{{ title }}</Label>
			<Label textWrap="true" class="message text-default">{{ message }}</Label>
		</StackLayout>
		<TextField
			@loaded="textfieldLoaded"
			v-model="text"
			autofocus
			class="text-field border-alt text-default placeholder"
			:hint="placeholderText"
		/>
		<ButtonWrapper>
			<Button col="0" row="0" @tap="close(true)" class="text-accent-contrast bg-accent">{{ okButtonText }}</Button>
			<Button col="2" row="0" class="text-default bg-alt" @tap="close(false)">{{ cancelButtonText }}</Button>
		</ButtonWrapper>
	</StackLayout>
</template>

<script>
import dialog from '@/mixins/dialog'
import ButtonWrapper from '@/components/ButtonWrapper'

export default {
	mixins: [dialog],

	props: {
		defaultText: {
			type: String,
			default: '',
		},
		placeholderText: {
			type: String,
			default: '',
		},
	},

	components: {
		ButtonWrapper,
	},

	data() {
		return {
			// initialize as defaultText, not bind
			text: this.defaultText,
		}
	},

	methods: {
		textfieldLoaded(e) {
			setTimeout(() => {
				e.object.focus()
			}, 100)
		},

		close(accept) {
			let res
			if (accept) {
				res = {
					result: true,
					text: this.text,
				}
			} else {
				res = {
					result: null,
					text: null,
				}
			}

			this.$modal.close(res)
		},
	},
}
</script>

<style lang="scss" scoped>
.modal-text {
	margin-top: 20;
	margin-left: 24;
	margin-right: 24;
	margin-bottom: 10;
}

.title {
	font-weight: 500;
}

.message {
	font-size: 16;

	border-width: 0;
}

.text-field {
	margin-top: 0;
	padding-top: 0;
	margin-left: 24;
	margin-right: 24;
	font-size: 16;
}
</style>
