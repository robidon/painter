<template>
	<div class="ImagesMenu">
		<ImagesMenuItem v-for="(image, index) in images" v-bind:image="image" v-on:select="select(index)"></ImagesMenuItem>
	</div>
</template>

<script>
import ImagesMenuItem from "./ImagesMenuItem.vue";

export default {
	data: function () {
		return {
			images:window.globals.images
		};		
	},
	computed: {
	},
	methods: {
		select: function (index) {
			this.$router.push({name:'game', params: {id: index}});
		}
	},
	components: {
		ImagesMenuItem
	}
}

</script>

<style>
	.ImagesMenu {
		padding: 1%;
		text-align: center;
	}
</style>