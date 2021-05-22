<template>
	<StackLayout>
		<MDTabs>
			<MDTabStrip>
				<MDTabStripItem class="tab-text" v-for="(group, i) of groups" :key="i">
					<Label>{{ group.title }}</Label>
				</MDTabStripItem>
			</MDTabStrip>

			<MDTabContentItem v-for="(group, i) of groups" :key="i">
				<Group :group="group" />
			</MDTabContentItem>
		</MDTabs>
	</StackLayout>
</template>

<script>
import Group from '@/components/Group'

export default {
	components: {
		Group,
	},

	computed: {
		groups() {
			return this.$store.state.groups
		},
	},
}
</script>

<style lang="scss" scoped>
.tab-text {
	// have to reset the font-size from tab-icon for some reason
	font-size: 12;
}
</style>
