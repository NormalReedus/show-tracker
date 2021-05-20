<template>
	<RadListView for="group in groups" itemReorder="true">
		<v-template>
			<FlexboxLayout class="pad-md group-item" alignItems="center" justifyContent="space-between">
				<StackLayout orientation="horizontal" class="item-section">
					<!-- grip icon -->
					<Label class="fas grayed"></Label>
					<Label class="group-title">{{ group.title }}</Label>
				</StackLayout>
				<StackLayout orientation="horizontal" class="item-section">
					<!-- pen icon -->
					<Label class="fas icon icon-left" @tap="renameGroup(group)"></Label>
					<!-- skull icon -->
					<Label class="fas icon icon-right" @tap="removeGroup(group.title)"></Label>
				</StackLayout>
			</FlexboxLayout>
		</v-template>
	</RadListView>
</template>

<script>
export default {
	computed: {
		groups() {
			return this.$store.state.groups
		},
	},

	methods: {
		renameGroup(group) {
			this.$store.dispatch('renameGroup', group)
		},

		removeGroup(title) {
			this.$store.dispatch('removeGroup', title)
		},
	},
}
</script>

<style lang="scss" scoped>
.grayed {
	opacity: 0.2;
	font-weight: 400;
}

.group-item {
	// set a bg-color that is not transparent
	background: rgba(0, 0, 0, 0.1);
}

.item-section {
	margin: 0;
	padding: 0;
}

.group-title {
	font-size: 16;
}

.icon {
	// &-left {
	// }

	&-right {
		color: hsl(0, 100%, 35%);
		// border-radius: 0 4 4 0; // if setting a bg
		margin-left: 10;
	}
}
</style>
