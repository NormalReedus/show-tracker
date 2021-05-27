<template>
	<Page actionBarHidden="true" class="bg-default status-bar">
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
//TODO: use type series in omdb query instead of all, and check if 'search' returns a list that can be chosen from if there are more than 1 hit
//https://www.omdbapi.com/

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
