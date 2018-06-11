<template>
	<div class="images-menu-item">
		<preloader v-if="showPreloader"></preloader>
		<div v-show="!showPreloader" class="images-menu-item-content">
			<canvas ref="canvas" v-on:click="$emit('select')"></canvas>
		</div>
	</div>
</template>

<script>
import Tinycolor from "tinycolor2";

export default {
	props:{
		image: {
			type:Object,
			default: function () { return {}; } 
		}
	},
	data: function () {
		return {
			showPreloader: true
		}
	},
	watch: {
		image: function (val) {
			this.showPreloader = true;
			this.update();
		}
	},
	methods: {
		update: function () {
			var canvas = this.$refs["canvas"];
			if (typeof(canvas)=="undefined" || typeof(this.image)=="undefined" || typeof(this.image.canvases)=="undefined") return;
			var pixelatedContext = canvas.getContext('2d');
			
			pixelatedContext.msImageSmoothingEnabled = false;
			pixelatedContext.mozImageSmoothingEnabled = false;
			pixelatedContext.webkitImageSmoothingEnabled = false;
			pixelatedContext.imageSmoothingEnabled = false;

			var newWidth = Math.min(canvas.width, this.image.width/this.image.height*canvas.height);
			var newHeight = this.image.height/this.image.width*newWidth;
			var x = (newWidth<canvas.width) ? ((canvas.width - newWidth)/2) : 0;
			var y = (newHeight<canvas.height) ? ((canvas.height - newHeight)/2) : 0;
			pixelatedContext.drawImage(this.image.canvases.light, 0, 0, this.image.width, this.image.height, x, y, newWidth, newHeight);
			if (this.image.canvases.colored) {
				pixelatedContext.drawImage(this.image.canvases.colored, 0, 0, this.image.width, this.image.height, x, y, newWidth, newHeight);
			}
			this.showPreloader = false;
		}		
	},
	mounted: function () {
		
		var canvas = this.$refs["canvas"];
		canvas.width = 150;
		canvas.height = 150;

		if (!this.image.loaded) return;

		this.update();
		this.$router.app.$on('update-image', (id)=>{
			if (typeof(this.image!="undefined") && id==this.image.id) {
				this.update();
			}
		});
	}
}
</script>

<style>
	.images-menu-item {
		position: relative;
    	overflow: hidden;		
		width: 48%;
		min-width: 100px;
		max-width: 200px; 
		display: inline-block;
		margin: 1%;
		background-color:#f9f9f9;
	}
	.images-menu-item:before{
	    content: "";
	    display: block;
	    padding-top: 100%;
	}
	.images-menu-item-content {
		position: absolute;
		width:100%;
		top:0;left:0;
	}
	.images-menu-item canvas{
		width:100%;
	}

</style>