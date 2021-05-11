<template>
	<Page class="ns-dark" actionBarHidden="true">
		<!-- <ActionBar>
      <Label text="Show Tracker" />
    </ActionBar> -->

		<TabView
			v-if="this.groups.length != 0"
			v-model="selectedIndex"
			@selectedIndexChange="indexChange"
			androidTabsPosition="bottom"
		>
			<TabViewItem
				:title="group.title"
				v-for="group of groups"
				:key="group.title"
			>
				<ScrollView>
					<FlexboxLayout flexWrap="wrap" paddingTop="30">
						<FlexboxLayout
							flexDirection="column"
							v-for="show of group.shows"
							:key="show.imdbId"
							width="50%"
							height="300"
							alignItems="center"
						>
							<Image
								:src="show.poster"
								loadMode="async"
								stretch="aspectFit"
								height="70%"
							/>
							<Label
								:text="
									`S: ${show.lastWatched.seasonNum} E: ${show.lastWatched.episodeNum}`
								"
							/>
							<Label
								v-if="show.nextAirDate"
								:text="`Next ep.: ${show.nextAirDate}`"
							/>
							<Label :text="`Runtime: ${show.nextRuntime}`" />
							<Label :text="`Episodes left: ${show.episodesLeft}`" />
						</FlexboxLayout>
					</FlexboxLayout>
				</ScrollView>
			</TabViewItem>
		</TabView>
	</Page>
</template>

<script>
import Group from '@/backend/Group'

export default {
	data: () => ({
		selectedIndex: 0,
		message: 'Show Tracker',
		groups: [],
	}),

	methods: {
		async indexChange(args) {
			// let newIndex = args.value
			// console.log('Current tab index: ' + this.selectedIndex)
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
