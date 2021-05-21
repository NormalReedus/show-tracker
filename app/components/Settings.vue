<template>
	<ScrollView>
		<StackLayout>
			<Button @tap="importShows" class="-outline">Import</Button>
			<Button @tap="exportShows" class="-outline">Export</Button>

			<Label class="h2 pad-md">Groups</Label>
			<GroupList />
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
		...mapActions(['importShows', 'exportShows']),
	},
}
</script>

<style lang="scss" scoped></style>
