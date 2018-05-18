<template>
	<div class="game">
    	<div class="link-back" v-on:click="navigateBack"><i class="arrow left"></i></div>
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
	computed: {
		image: function () {
			let image;
			if (typeof window.globals.images !== "undefined" && typeof this.$route.params.id !== undefined) {
				image = window.globals.images[this.$route.params.id];
			}
			return image;
		},
		palette: function () {
			let pal;
			if (typeof this.image !== "undefined") {
				pal = this.image.palettes.colors;
			}
			return pal;
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
  		},
  		navigateBack: function () {
  			this.$router.push("/imagesmenu");
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
.link-back {
	position: absolute;
	left: 5px;
	top: 5px;
	color: #222;
	background: #f0f0f0;
	width:40px; height: 40px;
	line-height: 40px;
	text-align: center;
	border-radius: 50%;
	z-index: 1;
}
.link-back .arrow {
	position: relative;
	top: 15px;
}
.arrow {
    border: solid black;
    border-width: 0 1px 1px 0;
    display: inline-block;
    width: 7px;
    height: 7px;
}

.right {
    transform: rotate(-45deg);
    -webkit-transform: rotate(-45deg);
}

.left {
    transform: rotate(135deg);
    -webkit-transform: rotate(135deg);
}

.up {
    transform: rotate(-135deg);
    -webkit-transform: rotate(-135deg);
}

.down {
    transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
}
</style>