<template>
	<div class="picker-container">
		<div class="colorpicker">
	    	<ColorButton
				v-for="(color, index) in palette"
				:key="index"
				v-bind:index="index" 
				v-bind:color="color"
				v-bind:selected="selectedColor == index"
				v-on:toggle="toggleButton(index)"></ColorButton>
		</div>
	</div>
</template>

<script>
import ColorButton from "./ColorButton.vue";

export default {
	props:{
		palette: {
			type: Array,
			default: function () { return []; }
		},
		selectedColor: {
			type:Number,
			default:0
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
	position: absolute;
	bottom:0px; left:0px;
	width: 100%;
    height: 70px;
    overflow: hidden;
}
.colorpicker {
	text-align: center;
    padding:5px 10px;
	height: 90px;
    white-space: nowrap;
    overflow-x: scroll;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
}
</style>