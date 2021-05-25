<template>
	<ScrollView>
		<StackLayout>
			<Button @tap="importGroups" class="-outline border-accent">Import groups</Button>
			<Button @tap="exportGroups" class="-outline border-accent">Export groups</Button>
			<Button @tap="newGroup" class="-outline border-accent">New group</Button>
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
