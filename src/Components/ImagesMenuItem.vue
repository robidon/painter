<template>
	<canvas class="ImagesMenuItem" ref="canvas" v-on:click="$emit('select')"></canvas>
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
	watch: {
		image: function (val) {
			this.update();
		}
	},
	methods: {
		update: function () {
			var canvas = this.$refs["canvas"];
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
		}		
	},
	mounted: function () {
		
		var canvas = this.$refs["canvas"];
		canvas.width = 150;
		canvas.height = 150;

		if (!this.image.loaded) return;

	}
}
</script>

<style>
	.ImagesMenuItem {
		width: 150px;
		height: 150px;
		display: inline-block;
		margin: 3px;
		background-color:#f9f9f9;
	}
</style>