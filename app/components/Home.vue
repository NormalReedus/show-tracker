<template>
	<Page class="ns-dark" actionBarHidden="true">
		<TabView androidTabsPosition="bottom">
			<TabViewItem iconSource="~/assets/show.png">
				<StackLayout>
					<TabView v-if="this.groups.length != 0">
						<TabViewItem
							:title="group.title"
							v-for="group of groups"
							:key="group.title"
						>
							<ScrollView>
								<FlexboxLayout
									v-if="group.shows.length > 0"
									flexWrap="wrap"
									paddingTop="20"
								>
									<Show
										v-for="show of group.shows"
										:key="show.imdbId"
										:show="show"
									/>
								</FlexboxLayout>
							</ScrollView>
						</TabViewItem>
					</TabView>
				</StackLayout>
			</TabViewItem>
			<TabViewItem iconSource="~/assets/gear.png">
				<StackLayout> </StackLayout>
			</TabViewItem>
		</TabView>
	</Page>
</template>

<script>
const clipboard = require('nativescript-clipboard')

import Group from '~/backend/Group'
import Show from '@/components/Show.vue'

export default {
	components: {
		Show,
	},
	data: () => ({
		selectedIndex: 0,
		message: 'Show Tracker',
		groups: [],
	}),

	methods: {
		test() {
			console.log('test')
		},
		async indexChange(args) {
			// let newIndex = args.value
			// console.log('Current tab index: ' + this.selectedIndex)
			// this.export()
			console.log(this.selectedIndex)
		},

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
</style>
