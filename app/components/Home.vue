<template>
	<Page actionBarHidden="true" class="bg-default">
		<MDBottomNavigation>
			<MDTabStrip class="bg-alt bottom-tab-strip">
				<MDTabStripItem class="bottom-strip-text">
					<!-- film icon -->
					<Label class="fas"></Label>
				</MDTabStripItem>
				<MDTabStripItem class="bottom-strip-text">
					<!-- gear icon -->
					<Label class="fas"></Label>
				</MDTabStripItem>
			</MDTabStrip>
			<MDTabContentItem>
				<Groups />
			</MDTabContentItem>
			<MDTabContentItem>
				<Settings />
			</MDTabContentItem>
		</MDBottomNavigation>
	</Page>
</template>

<script>
//TODO: use MD-ripple for e.g. add show https://github.com/nativescript-community/ui-material-components
//TODO: recreate the theme skin styles
// button outlines, button color (use the inverse text color class), default button bg,
//TODO: fix some shows not saving miscdata correctly (create batwoman, close app, reopen and look in modal)
//TODO: fix searchbar (custom component?)
//TODO: make a nicer statusbar (transparent sb with an empty stacklayout with the height of sb?)
//TODO: check if Tabs can handle updating without restarting
//TODO: remake dialogs as modals that can be styled
//TODO: test light mode styling after all css classes have been applied and tweak colors

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
.bottom-strip-text {
	font-size: 20;
}
</style>
