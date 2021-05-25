<template>
	<FlexboxLayout class="show-card">
		<FlexboxLayout class="add-show bg-alt" @tap="$emit('addShow')">
			<Label class="text-uppercase text-center h3 text-default">Add</Label>
			<!-- plus icon -->
			<Label class="fas text-center plus-icon text-default"></Label>
			<Label class="text-uppercase text-center h3 text-default">Show</Label>
		</FlexboxLayout>
	</FlexboxLayout>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.show-card {
	flex-direction: column;
	width: 50%;
	height: 250;
	align-items: center;
}
.add-show {
	height: 70%;
	// background: rgba(0, 0, 0, 0.1);
	width: 65%;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.plus-icon {
	font-size: 50;
	margin-top: 5;
	margin-bottom: 5;
	width: 100%;
}
</style>
