<template>
	<RadListView for="group in groups" itemReorder="true" class="group-list">
		<v-template>
			<FlexboxLayout class="pad-md" alignItems="center" justifyContent="space-between">
				<StackLayout orientation="horizontal" class="item-section">
					<Label class="fas grayed"></Label>
					<Label class="group-title">{{ group.title }}</Label>
				</StackLayout>
				<StackLayout orientation="horizontal" class="item-section">
					<Label>Btns</Label>
				</StackLayout>
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

	methods: {
		onItemSwipe(e) {
			console.log('pressing')
		},
	},
}
</script>

<style lang="scss" scoped>
.grayed {
	opacity: 0.3;
	font-weight: 400;
}

.group-list {
	//! No transparency
	background: #0000001a;
}

.item-section {
	margin: 0;
	padding: 0;
}

.group-title {
	font-size: 16;
}
</style>
