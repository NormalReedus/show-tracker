<template>
	<Page class="ns-dark" actionBarHidden="true">
		<TabView androidTabsPosition="bottom">
			<TabViewItem title="" class="fas tab-icon">
				<Groups />
			</TabViewItem>
			<!-- gear -->
			<TabViewItem title="" class="fas tab-icon">
				<Settings />
			</TabViewItem>
		</TabView>
	</Page>
</template>

<script>
// TODO: Add show - FAB or placeholder show with big + icon?
// TODO: Test without internet (after loading shows from storage, not newly created) (will displaying posters work?)
// TODO: Show errors when trying to use API but there's no internet (unless they fail silently which might be okay sometimes)
// TODO: Add saving to storage - should everything be saved every time or just what is edited? Finding the edited content might be a bigger overhead
// TODO: Rearrange groups + add remove groups in settings

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

	async beforeCreate() {
		const group1 = await this.$store.dispatch('newGroup', 'Magnus & Helena')
		const group2 = await this.$store.dispatch('newGroup', 'Magnus')

		const shows1 = [
			'game of thrones',
			'the walking dead',
			'the flash',
			'better call saul',
			'rick and morty',
			'lovecraft country',
		]

		const shows2 = ['band of brothers', 'the pacific']

		for (const show of shows1) {
			this.$store.dispatch('newShow', { group: group1, title: show })
		}
		for (const show of shows2) {
			this.$store.dispatch('newShow', { group: group2, title: show })
		}
	},
}
</script>

<style scoped lang="scss">
@import '@nativescript/theme/scss/variables/blue';

.tab-icon {
	font-size: 18;
}
</style>
