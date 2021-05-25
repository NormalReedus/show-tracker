<template>
	<Page actionBarHidden="true" class="bg-default">
		<!-- use bottomnavigation to style regularly -->
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
//TODO: fix searchbar (custom component?)
//TODO: make a nicer statusbar (transparent sb with an empty stacklayout with the height of sb?)
//TODO: check if Tabs can handle updating without restarting
//TODO: see if there is a way to style bottom nav tabs without hardcoding into template
//TODO: remake dialogs as modals that can be styled
//TODO: test if text on rounded buttons being cut off and icons being cut off can be fixed / is present when compiled
//TODO: test light mode styling after all css classes have been applied and tweak colors
//TODO: use BottomNavigation (not BottomNavigationBar) to overhaul the tabs in Home, so they can be styled with css like the rest
// https://github.com/nativescript-community/ui-material-components/blob/master/demo-vue/app/examples/BottomNavigation.vue

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
