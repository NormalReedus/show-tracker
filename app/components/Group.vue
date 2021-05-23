<template>
	<ScrollView>
		<StackLayout>
			<SearchBar v-model="filterQuery" @loaded="clearFocus" hint="Filter" class="search-bar" />
			<FlexboxLayout flexWrap="wrap">
				<Show v-for="show of displayShows" :key="show.imdbId" :show="show" @removeShow="removeShow" />
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
		// can't just map actions since the template wants these function names to exist
		addShow() {
			this.$store.dispatch('newShow', this.group)
		},

		removeShow(imdbId) {
			this.$store.dispatch('removeShow', { group: this.group, imdbId })
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

<style lang="scss" scoped>
.search-bar {
	margin-bottom: 10;
}
</style>
