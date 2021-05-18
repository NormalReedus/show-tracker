<template>
	<ScrollView>
		<StackLayout>
			<Button @tap="importShows" class="-outline">Import shows</Button>
			<Button @tap="exportShows" class="-outline">Export shows</Button>
		</StackLayout>
	</ScrollView>
</template>

<script>
import { mapActions } from 'vuex'

export default {
	methods: {
		...mapActions(['importShows', 'exportShows']),
		// exportShows() {
		// 	this.$store.dispatch('exportShows')
		// },
	},
}
</script>

<style lang="scss" scoped></style>
