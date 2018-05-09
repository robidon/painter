<template>
	<div class="game">
		<Field ref="field"
			v-bind:palette="palette"
			v-bind:selectedColor="selectedColor"></Field>
		<ColorPicker
			v-bind:palette="palette"
			v-bind:selectedColor="selectedColor"
			v-on:setColor="changeColor"></ColorPicker>
	</div>
</template>

<script>

import Tinycolor from "tinycolor2";
import Field from './Field.vue';
import ColorPicker from './ColorPicker.vue';

export default {
	data: function () {
		return {
			greeting: 'Helasalo',
			palette:[],
			selectedColor:0
		}
	},
	created: function () {
		// @TODO generate pixels field and palette from images, not randomly 
		var paletteColorsCount = 2;
		for (var i = 0; i < paletteColorsCount;i++) {
			let randColor = Tinycolor.random();
			this.palette.push(randColor);
		}
  	},
  	mounted: function () {
		this.$refs.field.render();
  	},
  	methods: {
  		changeColor:function (newColorIndex) {
  			this.selectedColor = newColorIndex;
  		}
  	},
	components: {
		Field, ColorPicker
	}
}

</script>

<style>
.game {
	position:absolute;
	left:0;top:0;bottom:0;right:0;
}
</style>