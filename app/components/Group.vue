<template>
	<ScrollView>
		<StackLayout>
			<SearchBar v-model="filterQuery" @loaded="clearFocus" hint="Filter" />
			<FlexboxLayout v-if="displayShows.length > 0" flexWrap="wrap">
				<Show v-for="show of displayShows" :key="show.imdbId" :show="show" @removeShow="group.removeShow($event)" />
				<AddShow @addShow="addShow" />
			</FlexboxLayout>
		</StackLayout>
	</ScrollView>
</template>

<script>
import fuzzy from 'fuzzy'
import Show from '@/components/Show'
import AddShow from '@/components/AddShow'

const FUZZY_OPTS = {
	extract(show) {
		return show.title
	},
}

export default {
	components: {
		Show,
		AddShow,
	},

	props: {
		group: {
			type: Object,
			required: true,
		},
	},

	data: () => ({
		filterQuery: '',
	}),

	computed: {
		displayShows() {
			const results = fuzzy.filter(this.filterQuery, this.group.shows, FUZZY_OPTS)
			const shows = results.map(match => match.original)

			// this mutates the array, but fortunately shows are a copy of the array still with reference to original shows
			return shows.sort(favoriteSort)
		},
	},

	methods: {
		addShow() {
			this.$store.dispatch('newShow', this.group)
		},

		clearFocus(e) {
			const field = e.object

			field.android.clearFocus()
		},
	},
}

function favoriteSort(a, b) {
	return b.favorite - a.favorite
}
</script>

<style lang="scss" scoped></style>
