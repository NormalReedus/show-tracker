<template>
	<StackLayout>
		<MDTabs>
			<MDTabStrip class="top-tab-strip bg-alt">
				<MDTabStripItem class="top-strip-text text-default" v-for="(group, i) of groups" :key="i">
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
.top-strip-text {
	font-size: 12;
	font-weight: 500;
}
</style>
