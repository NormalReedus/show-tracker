<template>
	<Page class="ns-dark" actionBarHidden="true">
		<!-- <ActionBar>
      <Label text="Show Tracker" />
    </ActionBar> -->

		<TabView
			v-model="selectedIndex"
			@selectedIndexChange="indexChange"
			androidTabsPosition="bottom"
		>
			<TabViewItem title="One">
				<ScrollView>
					<Label :text="message" />
				</ScrollView>
			</TabViewItem>
			<TabViewItem title="Two">
				<Label text="Content for Tab 2" />
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
	}),

	methods: {
		async indexChange(args) {
			// let newIndex = args.value
			// console.log('Current tab index: ' + this.selectedIndex)
			const group = new Group('Magnus & Helena')
			await group.addShow('batwoman')
			console.log(group)
		},
	},
}
</script>

<style scoped lang="scss">
@import '@nativescript/theme/scss/variables/blue';
</style>
