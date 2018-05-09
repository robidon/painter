<template>
	<div class="game">
		<div>Here will be the field</div>
		<ColorPicker v-bind:palette="palette"></ColorPicker>
	</div>
</template>

<script>

import Tinycolor from "tinycolor2";
import ColorPicker from './ColorPicker.vue';

export default {
	data: function () {
		return {
			greeting: 'Helasalo',
			palette:[]
		}
	},
	created: function () {
		var paletteColorsCount = 4;
		for (var i = 0; i < paletteColorsCount;i++) {
			let randColor = Tinycolor.random();
			this.palette.push(randColor);
		} 
    	console.log(this.palette);
  	},	
	components: {
		ColorPicker
	}
}

</script>

<style>
.game {
	position:absolute;
	left:0;top:0;bottom:0;right:0;
}
</style>