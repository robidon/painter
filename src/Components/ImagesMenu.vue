<template>
	<div class="ImagesMenu">
		<div class="ImagesList">
			<b-tabs v-model="activeTab" position="is-centered">
	            <b-tab-item>
	            	<template slot="header">
		                <span> All <b-tag rounded> {{images.length}} </b-tag> </span>
		            </template>
					<ImagesMenuItem
						v-for="(image, index) in images"
						v-bind:image="image"
						v-on:select="select(image)"></ImagesMenuItem>
	            </b-tab-item>

	            <b-tab-item>
	            	<template slot="header">
		                <span> Started <b-tag rounded> {{startedImages.length}} </b-tag> </span>
		            </template>
					<ImagesMenuItem
						v-for="(image, index) in startedImages"
						v-bind:image="image"
						v-on:select="select(image)"></ImagesMenuItem>
	            </b-tab-item>

	            <b-tab-item>
	            	<template slot="header">
		                <span> Complete <b-tag rounded> {{completedImages.length}} </b-tag> </span>
		            </template>
					<ImagesMenuItem
						v-for="(image, index) in completedImages"
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
		completedImages: function () {
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