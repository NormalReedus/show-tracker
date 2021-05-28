<template>
	<StackLayout :class="{ 'ns-light': themeMode === 'light' }" class="modal bg-default">
		<StackLayout class="modal-text">
			<Label textWrap="true" class="h2 title text-default">{{ title }}</Label>
			<Label textWrap="true" class="message text-default">{{ message }}</Label>
		</StackLayout>
		<ButtonWrapper>
			<Button col="0" row="0" class="text-default bg-alt" @tap="close(false)">{{ cancelButtonText }}</Button>
			<Button
				col="2"
				row="0"
				@tap="close(true)"
				:class="danger ? 'bg-danger' : 'bg-accent'"
				class="text-accent-contrast"
			>
				{{ okButtonText }}
			</Button>
		</ButtonWrapper>
	</StackLayout>
</template>

<script>
import dialog from '@/mixins/dialog'
import ButtonWrapper from '@/components/ButtonWrapper'

export default {
	mixins: [dialog],
	props: {
		danger: {
			type: Boolean,
			required: false,
		},
	},
	components: {
		ButtonWrapper,
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
</style>
