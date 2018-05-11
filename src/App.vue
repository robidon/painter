<template>
	<div id="app">
		<Menu v-if="selectedImageIndex === -1" v-bind:images="images"></Menu>
		<Game v-if="selectedImageIndex !== -1" v-bind:image="images[selectedImageIndex]"></Game>
	</div>
</template>

<script>
import Game from './Components/Game.vue'
import Menu from './Components/Menu.vue'

export default {
	data: function () {
		return {
			selectedImageIndex: -1,
			images: []
		}
	},
	created: function () {
		this.images = [
			{
				width:5,
				height:5,
				data:[[0,0,0,0,0],
					  [0,1,1,1,0],
					  [0,1,1,2,0],
					  [0,1,2,3,0],
					  [0,0,0,0,0]],
				colored:[[0,0,0,0,0],
						 [0,0,0,0,0],
						 [0,0,0,0,0],
						 [0,0,0,0,0],
						 [0,0,0,0,0]],
				palette:["#ff0000","#00ff00","#0000ff"]
			},
			{
				width:5,
				height:5,
				data:[[0,0,0,0,0],
					  [0,2,1,1,0],
					  [0,1,2,3,0],
					  [0,1,3,2,0],
					  [0,0,0,0,0]],
				colored:[[0,0,0,0,0],
						 [0,0,0,0,0],
						 [0,0,0,0,0],
						 [0,0,0,0,0],
						 [0,0,0,0,0]],
				palette:["#f00000","#00f000","#0000f0"]
			}
		];
	},
	components: {
		Game, Menu
	}
}

</script>

<style>
#app {
	background-color:#ffffff;
	min-height: 100%;
	min-width: 100%;
}
</style>