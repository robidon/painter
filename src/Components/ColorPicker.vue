<template>
	<div class="picker-container">
		<div class="colorpicker">
	    	<ColorButton
				v-for="(color, index) in orderedPalette"
				:key="index"
				v-bind:index="color.index" 
				v-bind:color="color.color"
				v-bind:complete="color.complete"
				v-bind:selected="selectedColor == color.index"
				v-on:toggle="toggleButton(color.index)"></ColorButton>
		</div>
	</div>
</template>

<script>
import _ from 'underscore';
import ColorButton from "./ColorButton.vue";

export default {
	props:{
		image: {
			type:Object
		},
		palette: {
			type: Array,
			default: function () { return []; }
		},
		selectedColor: {
			type:Number,
			default:0
		}
	},
	computed: {
		orderedPalette: function () {
			var pal = [];
			for (var c=0;c<this.palette.length;c++) {
				pal.push({
					color:this.palette[c],
					index:c,
					freq:this.image.palettes.totals[c],
					complete:this.image.palettes.colored[c]>=this.image.palettes.totals[c]
				});
			}
			return _.sortBy(pal, 'freq').reverse();
		}
	},
	methods: {
		toggleButton: function (index) {
			this.$emit("setColor", index);
		}
	},
	components: {
		ColorButton
	}
}
</script>

<style>
.picker-container {
	background:#f7f7f7;
	position: absolute;
	bottom:0px; left:0px;
	width: 100%;
    height: 70px;
    overflow: hidden;
}
.colorpicker {
	text-align: center;
    padding:8px 10px;
	height: 90px;
    white-space: nowrap;
    overflow-x: scroll;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
}
</style>