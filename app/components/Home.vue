<template>
	<Page class="ns-dark" actionBarHidden="true">
		<TabView androidTabsPosition="bottom">
			<TabViewItem title="" class="fas tab-icon">
				<StackLayout>
					<TabView v-if="this.groups.length != 0">
						<TabViewItem :title="group.title" v-for="group of groups" :key="group.title" class="tab-text">
							<!-- search bar -->
							<ScrollView>
								<FlexboxLayout v-if="group.shows.length > 0" flexWrap="wrap" paddingTop="25">
									<Show
										v-for="show of group.shows"
										:key="show.imdbId"
										:show="show"
										@removeShow="group.removeShow($event)"
									/>
								</FlexboxLayout>
							</ScrollView>
						</TabViewItem>
					</TabView>
				</StackLayout>
			</TabViewItem>
			<!-- gear -->
			<TabViewItem title="" class="fas tab-icon">
				<Settings />
			</TabViewItem>
		</TabView>
	</Page>
</template>

<script>
// TODO: Wrap show list in component (like settings)
// TODO: Add show - FAB or placeholder show with big + icon?
// TODO: Add favorite indicator to shows
// TODO: Add favorite indicator to show modals that can toggle
// TODO: Add search bar / sorting (with favorites)
// TODO: Test without internet (will displaying posters work?)
// TODO: Show errors when trying to use API but there's no internet (unless they fail silently which might be okay sometimes)
// TODO: Add saving to storage - should everything be saved every time or just what is edited? Finding the edited content might be a bigger overhead

const clipboard = require('nativescript-clipboard')

import Group from '~/backend/Group'
import Show from '@/components/Show'
import Settings from '@/components/Settings'

export default {
	components: {
		Show,
		Settings,
	},
	data: () => ({
		selectedIndex: 0,
		message: 'Show Tracker',
		groups: [],
	}),

	methods: {
		async exportShows() {
			// console.log(JSON.stringify(this.groups))
			try {
				await clipboard.setText(JSON.stringify(this.groups))
			} catch (err) {
				//! Make error pop-up
				return
			}

			alert({
				title: 'Export',
				message: 'Your data has been copied to the clipboard.',
				okButtonText: 'Yup',
			})
		},

		//! Buggy until going through all tabs
		async importShows() {
			let clipboardContent

			try {
				clipboardContent = await clipboard.getText()
			} catch (err) {
				//! Make error pop-up
				console.log(err, 'Cannot get text from clipboard')
				return
			}

			// Generate groups and shows (with methods etc) from static json
			const groups = Group.importGroups(clipboardContent)

			this.groups.push(...groups)

			//! Update all shows
			alert({
				title: 'Import',
				message: 'Your shows have been imported.',
				okButtonText: 'Awesome',
			})
		},
	},

	async beforeCreate() {
		const group1 = new Group('Magnus & Helena')
		await group1.addShow('game of thrones')
		await group1.addShow('the walking dead')
		await group1.addShow('the flash')
		await group1.addShow('better call saul')
		await group1.addShow('watchmen')
		await group1.addShow('rick and morty')

		const group2 = new Group('Magnus')
		await group2.addShow('band of brothers')
		await group2.addShow('the pacific')

		this.groups = [group1, group2]
	},
}
</script>

<style scoped lang="scss">
@import '@nativescript/theme/scss/variables/blue';

.tab-icon {
	font-size: 18;
}

.tab-text {
	// Have to reset the font-size from tab-icon for some reason
	font-size: 12;
}
</style>
