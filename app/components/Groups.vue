<template>
	<StackLayout>
		<TabView v-if="this.groups.length != 0">
			<TabViewItem :title="group.title" v-for="group of groups" :key="group.title" class="tab-text">
				<Group :group="group" />
				<!-- <StackLayout>
					<SearchBar v-model="filterQuery" />
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
				</StackLayout> -->
			</TabViewItem>
		</TabView>
	</StackLayout>
</template>

<script>
// import Show from '@/components/Show'
import Group from '@/components/Group'

export default {
	components: {
		// Show,
		Group,
	},

	// data: () => ({
	// 	filterQuery: '',
	// }),

	computed: {
		groups() {
			return this.$store.state.groups
		},

		// filteredShows() {
		// 	return
		// }
	},
}
</script>

<style lang="scss" scoped></style>
