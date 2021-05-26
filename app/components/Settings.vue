<template>
	<ScrollView>
		<StackLayout>
			<Button @tap="importGroups" class="bg-alt">Import groups</Button>
			<Button @tap="exportGroups" class="bg-alt">Export groups</Button>
			<Button @tap="newGroup" class="bg-accent text-accent-contrast">New group</Button>
			<GroupList class="group-list" />
		</StackLayout>
	</ScrollView>
</template>

<script>
import { mapActions } from 'vuex'
import GroupList from '@/components/GroupList'

export default {
	components: {
		GroupList,
	},

	methods: {
		...mapActions(['newGroup', 'importGroups', 'exportGroups']),
	},
}
</script>

<style lang="scss" scoped>
.group-list {
	margin-top: 8;
}
</style>
