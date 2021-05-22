<template>
	<ScrollView>
		<StackLayout>
			<Button @tap="newGroup" class="-outline">New group</Button>
			<Button @tap="importGroups" class="-outline">Import groups</Button>
			<Button @tap="exportGroups" class="-outline">Export groups</Button>
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
