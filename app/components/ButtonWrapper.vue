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
	padding-left: 12;
	padding-right: 12;

	button {
		width: 100%;
	}
}
</style>
