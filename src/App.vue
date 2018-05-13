<template>
	<div id="app">
		<ImagesMenu v-if="selectedImageIndex === -1" v-bind:images="images" v-on:select="select"></ImagesMenu>
		<Game v-if="selectedImageIndex !== -1" v-bind:image="images[selectedImageIndex]"></Game>
	</div>
</template>

<script>
import Game from './Components/Game.vue'
import ImagesMenu from './Components/ImagesMenu.vue'

export default {
	data: function () {
		return {
			selectedImageIndex: -1,
			images: [],
			imageNames: []
		}
	},
	created: function () {
		this.imageNames = ['i/Betta-PNG-Photos.json',
			'i/cat.json',
			'i/Donkey-Kong-PNG-Photos.json',
			'i/Leopard-PNG-Free-Download.json',
			'i/Leopard-Transparent-Background.json',
			'i/Pile-of-Skulls-PNG-Clipart.json'];
		this.images=[];
		for(var i =0;i<this.imageNames.length;i++) {
			fetch(this.imageNames[i])
				.then(r => r.json())
				.then(json=>{
					this.images.push(json);
				});
		}
	},
	methods:{
		select:function(index) {
			console.log('aaa');
			this.selectedImageIndex = index;
		}
	},
	components: {
		Game, ImagesMenu
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