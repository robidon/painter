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
	computed: {
		palette: function () {
			/*var newPalette = [];
			for (var i=0; i<this.image.palettes.colors.length; i++) {
				newPalette.push(Tinycolor(this.image.palettes.colors[i]));
			}*/
			return this.image.palettes.colors;
		}
	},
	data: function () {
		return {
			selectedColor:0
		}
	},
	created: function () {

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