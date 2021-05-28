<template>
	<ScrollView>
		<StackLayout>
			<!-- custom design -->
			<Search @clear="filter = ''" v-model="filter" />

			<StackLayout class="line bg-alt"> </StackLayout>
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
import Search from '@/components/Search'

const FUZZY_OPTS = {
	extract(show) {
		return show.title
	},
}

export default {
	components: {
		Show,
		AddShow,
		Search,
	},

	props: {
		group: {
			type: Object,
			required: true,
		},
	},

	data: () => ({
		filter: '',
	}),

	computed: {
		displayShows() {
			const results = fuzzy.filter(this.filter, this.group.shows, FUZZY_OPTS)
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
	},
}

function favoriteSort(a, b) {
	return b.favorite - a.favorite
}
</script>

<style lang="scss" scoped>
.line {
	margin-left: 16;
	margin-right: 16;
	height: 1;
	margin-bottom: 10;
}
</style>
