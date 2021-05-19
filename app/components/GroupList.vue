<template>
	<RadListView for="group in groups" itemReorder="true">
		<v-template>
			<FlexboxLayout class="group-item" justifyContent="space-between">
				<Label>{{ group.title }}</Label>
				<Label class="fas grayed"></Label>
			</FlexboxLayout>
		</v-template>
	</RadListView>
</template>

<script>
// TODO: Swipe to delete group-item
// Example here https://github.com/ProgressNS/nativescript-ui-samples-vue/blob/master/listview/app/examples/SwipeActions.ts

export default {
	computed: {
		groups() {
			return this.$store.state.groups
		},
	},
}
</script>

<style lang="scss" scoped>
.grayed {
	opacity: 0.3;
	font-weight: 400;
}

.group-item {
	padding: 8 16;
	// use background color
}
</style>
