<template>
	<GridLayout columns="*, 8, *" rows="auto" class="button-wrapper">
		<slot />
	</GridLayout>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.button-wrapper {
	// background: red;
	padding-left: 16;
	padding-right: 16;
	padding-top: 8;

	// .button {
	// 	width: 100%;
	// }
}
</style>
