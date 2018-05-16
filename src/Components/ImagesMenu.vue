<template>
	<div class="ImagesMenu">
		<ImagesMenuItem v-for="(image, index) in images" v-bind:image="image" v-on:select="select(index)"></ImagesMenuItem>
	</div>
</template>

<script>
import ImagesMenuItem from "./ImagesMenuItem.vue";

export default {
	props: {
		images: {
			type: Array,
			default: function () { return []; }
		}
	},
	computed: {
	},
	methods: {
		select: function (index) {
			this.$emit("select", index);
		}
	},
	components: {
		ImagesMenuItem
	}
}

</script>

<style>
	.ImagesMenu {
		padding:3px;
	}
</style>