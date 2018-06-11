<template>
	<div class="ImagesMenu">
		<div class="ImagesList">
			<b-tabs v-model="activeTab" position="is-centered">
	            <b-tab-item label="All">
					<ImagesMenuItem
						v-for="(image, index) in images"
						v-bind:image="image"
						v-on:select="select(image)"></ImagesMenuItem>
	            </b-tab-item>

	            <b-tab-item label="Started">
					<ImagesMenuItem
						v-for="(image, index) in startedImages"
						v-bind:image="image"
						v-on:select="select(image)"></ImagesMenuItem>
	            </b-tab-item>

	            <b-tab-item label="Complete">
					<ImagesMenuItem
						v-for="(image, index) in completeImages"
						v-bind:image="image"
						v-on:select="select(image)"></ImagesMenuItem>
	            </b-tab-item>

	        </b-tabs>
		</div>
	</div>
</template>

<script>
import ImagesMenuItem from "./ImagesMenuItem.vue";

export default {
	data: function () {
		return {
			activeTab: 0,
			images:window.globals.images
		};		
	},
	computed: {
		currentImages: function () {
			return this.images.filter((im) => {
				return (im.pixelsToColorCount > im.coloredPixelsCount);
			});
		},
		startedImages: function () {
			return this.images.filter((im) => {
				return (im.coloredPixelsCount>0) && (im.pixelsToColorCount > im.coloredPixelsCount);
			});	
		},
		completeImages: function () {
			return this.images.filter((im) => {
				return (im.pixelsToColorCount == im.coloredPixelsCount);
			});	
		}
	},
	created: function () {
		this.$router.app.$on('update-image', (id)=>{
			this.$forceUpdate();
		});
	},
	methods: {
		select: function (image) {
			if (this.images.indexOf(image)!=-1) {
				this.$router.push({name:'game', params: {id: this.images.indexOf(image)}});
			}
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