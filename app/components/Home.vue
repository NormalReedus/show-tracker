<template>
	<Page class="ns-dark" actionBarHidden="true">
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
// TODO: Test without internet (after loading shows from storage, not newly created) (will displaying posters work?)
// TODO: Show errors when trying to use API but there's no internet (unless they fail silently which might be okay sometimes)
// TODO: Add saving to storage in store (observable?) - should everything be saved every time or just what is edited? Finding the edited content might be a bigger overhead
// TODO: Fix watching groups - will only react on top-level changes (not shows etc)

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

	watch: {
		groups(oldVal, newVal) {
			console.log('I sense a disturbance')
		},
	},
}
</script>

<style scoped lang="scss">
@import '@nativescript/theme/scss/variables/blue';

.tab-icon {
	font-size: 18;
}
</style>
