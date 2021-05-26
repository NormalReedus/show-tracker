<template>
	<FlexboxLayout class="search">
		<!-- magnifying glass -->
		<TextField :text="value" @textChange="$emit('input', $event.value)" class="search-field fas" hint=" " />
		<!-- X icon -->
		<Label class="fas clear-btn" @tap="$emit('clear')"></Label>
	</FlexboxLayout>
</template>

<script>
export default {
	props: {
		value: {
			type: String,
			required: true,
		},
	},
}
</script>

<style lang="scss" scoped>
.search {
	padding-top: 3;
	padding-bottom: 3;

	align-items: center;
	justify-content: space-between;

	&-field {
		width: 80%;
		padding-bottom: 8;
		font-size: 16;
		font-weight: 400;
		border-width: 0;
	}
}

.clear-btn {
	font-size: 22;
	font-weight: 200;
	margin-right: 16;
}
</style>
