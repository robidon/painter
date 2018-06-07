<template>
	<div class="ImagesMenu">
		<div class="ImagesList">
			<ImagesMenuItem
				v-for="(image, index) in filteredImages"
				v-bind:image="image"
				v-on:select="select(index)"></ImagesMenuItem>
		</div>
	</div>
</template>

<script>
import ImagesMenuItem from "./ImagesMenuItem.vue";

export default {
	data: function () {
		return {
			images:window.globals.images,
			filter:'current'
		};		
	},
	computed: {
		filteredImages: function () {
			return this.images.filter((im) => {
				switch (this.filter) {
					case 'complete': return im.complete;
					case 'current': return !im.personal && !im.complete;
					case 'personal': return im.personal;
				}
			})
		}
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