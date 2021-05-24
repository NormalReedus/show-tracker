<template>
	<Page actionBarHidden="true" class="page">
		<TabView androidTabsPosition="bottom">
			<!-- film icon -->
			<TabViewItem title="" class="fas tab-icon">
				<Groups />
			</TabViewItem>
			<!-- gear icon -->
			<TabViewItem title="" class="fas tab-icon">
				<Settings />
			</TabViewItem>
		</TabView>
	</Page>
</template>

<script>
import Groups from '@/components/Groups'
import Settings from '@/components/Settings'

export default {
	components: {
		Settings,
		Groups,
	},
	data: () => ({
		selectedIndex: 0,
		message: 'Show Tracker',
	}),
	computed: {
		groups() {
			return this.$store.state.groups
		},
	},
}
</script>

<style scoped lang="scss">
.tab-icon {
	font-size: 18;
}
</style>
