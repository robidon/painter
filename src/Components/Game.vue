<template>
	<div class="game" ref="game">
		<preloader v-if="showPreloader"></preloader>
    	<div class="link-back" v-on:click="navigateBack"><i class="arrow left"></i></div>
		<div v-show="!showPreloader" class="game-content">
			<GameCanvas ref="canvas"
				v-bind:palette="palette"
				v-bind:image="image"
				v-bind:selectedColor="selectedColor"
				v-on:render-complete="renderComplete"
				v-on:level-complete="levelComplete"
				v-on:mark-colored="markColored"></GameCanvas>
			<ColorPicker
				v-bind:image="image"
				v-bind:palette="palette"
				v-bind:selectedColor="selectedColor"
				v-on:setColor="changeColor"></ColorPicker>
		</div>
	</div>
</template>

<script>
import _ from 'underscore';
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
			selectedColor:0,
			showPreloader: true
		}
	},
	created: function () {
		this.debouncedSaveImage = _.debounce(this.saveImage,500);
  	},
  	mounted: function () {
		setTimeout(()=>{
			this.selectedColor = 0;
	  		this.showPreloader = true;
			this.$refs.canvas.render(this.$refs.game.clientWidth, this.$refs.game.clientHeight-70);
	  	},0);
  	},
  	methods: {
  		renderComplete: function () {
  			this.showPreloader = false;
  		},
  		saveImage: function() {
  			if (typeof (this.image)!="undefined") {
				this.$router.app.$emit('save-image', this.image.id);  			
  			}
  		},
  		markColored:function (point) {
  			this.image.pixels.colored[point.x][point.y] = 1;
  			this.debouncedSaveImage();
  		},
  		levelComplete:function() {
  			
  		},
  		changeColor:function (newColorIndex) {
  			this.selectedColor = newColorIndex;
  		},
  		navigateBack: function () {
  			this.saveImage();
  			this.selectedColor = 0;
	  		this.showPreloader = true;
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
	position:relative;
	width:100%;height: 100%;
}
.game-content {
	position:absolute;
	left:0px;top:0px;
	width:100%;
	height: 100%;
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