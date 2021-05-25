<template>
	<RadListView for="group in groups" itemReorder="true">
		<v-template>
			<FlexboxLayout class="pad-md bg-alt" alignItems="center" justifyContent="space-between">
				<StackLayout orientation="horizontal" class="item-section">
					<!-- grip icon -->
					<Label class="fas grip text-disabled-deep"></Label>
					<Label class="group-title text-default">{{ group.title }}</Label>
				</StackLayout>
				<StackLayout orientation="horizontal" class="item-section">
					<!-- pen icon -->
					<Label class="fas icon icon-left text-accent-muted" @tap="renameGroup(group)"></Label>
					<!-- X icon -->
					<Label class="fas icon icon-right text-danger" @tap="removeGroup(group.title)"></Label>
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
.grip {
	font-weight: 400;
	font-size: 20;
}

.item-section {
	margin: 0;
	padding: 0;
}

.group-title {
	font-size: 16;
	font-weight: 500;
	margin-left: 10;
}

.icon {
	&-left {
		font-size: 18;
	}
	&-right {
		margin-left: 10;
		width: 30;
		font-size: 24;
	}
}
</style>
