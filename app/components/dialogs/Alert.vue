<template>
	<StackLayout :class="{ 'ns-light': themeMode === 'light' }" class="modal bg-default">
		<StackLayout class="modal-text">
			<Label textWrap="true" class="h2 title text-default">{{ title }}</Label>
			<Label textWrap="true" class="message text-default">{{ message }}</Label>
		</StackLayout>
		<Button @tap="close" class="bg-alt">{{ okButtonText }}</Button>
	</StackLayout>
</template>

<script>
import dialog from '@/mixins/dialog'

export default {
	mixins: [dialog],
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
