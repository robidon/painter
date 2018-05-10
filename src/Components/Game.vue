<template>
	<div class="game">
		<Field ref="field"
			v-bind:palette="palette"
			v-bind:field="field"
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
	props: {
		field: {
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

		// generate random pixel field
		// @todo remove this
		var field = {
			height : 30,
			width : 40,
			data : [],
			colored : []
		};
		var paletteColorsCount = 10;
		for (var y=0;y<field.height;y++) {
			field.data.push([]);
			field.colored.push([]);
			for (var x=0;x<field.width;x++) {
				let color = Math.floor(Math.random()*paletteColorsCount);
				field.data[y].push( (Math.random()>0.5) ? color : -1 );
				field.colored[y].push(0);
			}
		}
		//yes, i know about vue warning
		this.field = field;

		// @todo generate pixels field and palette from images, not randomly 
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