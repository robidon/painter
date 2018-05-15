<template>
	<canvas ref="canvas" v-on:click="$emit('select')"></canvas>
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
			var shadowCanvas = document.createElement('canvas');
			var context = shadowCanvas.getContext('2d');
			var pal = [];
			for (var i = 0;i<this.image.palette.length;i++) {
				var color = Tinycolor(this.image.palette[i]);
				var rgb = color.desaturate(100).brighten(50).toRgb();
				Array.prototype.push.apply(pal, [rgb.r,rgb.g,rgb.b,rgb.a*255]);
			}
			
			var imageData = context.createImageData(this.image.width,this.image.height);
			for (var y = 0;y<this.image.height;y++) {
				for(var x = 0;x<this.image.width;x++) {
					if(this.image.pixels[y*this.image.width+x]==0) {
						imageData.data[(y*this.image.width+x)*4]
						 = imageData.data[(y*this.image.width+x)*4+1]
						 = imageData.data[(y*this.image.width+x)*4+2]
						 = imageData.data[(y*this.image.width+x)*4+3]
						 = 0;
						 continue;							
					}
					imageData.data[(y*this.image.width+x)*4] = pal[(this.image.pixels[y*this.image.width+x]-1)*4];
					imageData.data[(y*this.image.width+x)*4+1] = pal[(this.image.pixels[y*this.image.width+x]-1)*4+1];
					imageData.data[(y*this.image.width+x)*4+2] = pal[(this.image.pixels[y*this.image.width+x]-1)*4+2];
					imageData.data[(y*this.image.width+x)*4+3] = pal[(this.image.pixels[y*this.image.width+x]-1)*4+3];
				}
			}
			var pixelatedContext = canvas.getContext('2d');
			
			context.putImageData(imageData, 0, 0);

			pixelatedContext.msImageSmoothingEnabled = false;
			pixelatedContext.mozImageSmoothingEnabled = false;
			pixelatedContext.webkitImageSmoothingEnabled = false;
			pixelatedContext.imageSmoothingEnabled = false;
			pixelatedContext.drawImage(shadowCanvas, 0, 0, this.image.width, this.image.height, 0, 0, canvas.width, canvas.height);
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
	canvas {
		background-color:#f0f0f0;
	}
</style>