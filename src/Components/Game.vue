<template>
	<div class="game">
		<GameCanvas ref="canvas"
			v-bind:palette="palette"
			v-bind:image="image"
			v-bind:selectedColor="selectedColor"></GameCanvas>
		<ColorPicker
			v-bind:palette="palette"
			v-bind:selectedColor="selectedColor"
			v-on:setColor="changeColor"></ColorPicker>
	</div>
</template>

<script>

import Tinycolor from "tinycolor2";
import GameCanvas from './GameCanvas.vue';
import ColorPicker from './ColorPicker.vue';

export default {
	props: {
		image: {
			type: Object,
			default: function () { return {}; }
		}
	},
	data: function () {
		return {
			palette:[],
			selectedColor:0
		}
	},
	created: function () {

		// generate random pixel image
		// @todo remove this
		var image = {
			height : 30,
			width : 40,
			data : [],
			colored : []
		};
		var paletteColorsCount = 10;
		for (var y=0;y<image.height;y++) {
			image.data.push([]);
			image.colored.push([]);
			for (var x=0;x<image.width;x++) {
				let color = Math.floor(Math.random()*paletteColorsCount);
				image.data[y].push( (Math.random()>0.5) ? color : -1 );
				image.colored[y].push(0);
			}
		}
		//yes, i know about vue warning
		this.image = image;

		// @todo generate pixels image and palette from images, not randomly 
		for (var i = 0; i < paletteColorsCount;i++) {
			let randColor = Tinycolor.random();
			this.palette.push(randColor);
		}

  	},
  	mounted: function () {
		this.$refs.canvas.render();
  	},
  	methods: {
  		changeColor:function (newColorIndex) {
  			this.selectedColor = newColorIndex;
  		}
  	},
	components: {
		GameCanvas, ColorPicker
	}
}

</script>

<style>
.game {
	position:absolute;
	left:0;top:0;bottom:0;right:0;
}
</style>