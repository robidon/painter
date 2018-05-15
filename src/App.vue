<template>
	<div id="app">
		<ImagesMenu v-if="selectedImageIndex === -1" v-bind:images="images" v-on:select="select"></ImagesMenu>
		<Game v-if="selectedImageIndex !== -1" v-bind:image="images[selectedImageIndex]"></Game>
	</div>
</template>

<script>
import Game from './Components/Game.vue'
import ImagesMenu from './Components/ImagesMenu.vue'
import Vue from 'vue';

export default {
	data: function () {
		return {
			selectedImageIndex: -1,
			images: [],
			imageNames: []
		}
	},
	created: function () {
		
		this.images = [
			{id:'Betta-PNG-Photos'},
			{id:'cat'},
			{id:'Donkey-Kong-PNG-Photos'},
			{id:'Leopard-PNG-Free-Download'},
			{id:'Leopard-Transparent-Background'},
			{id:'Pile-of-Skulls-PNG-Clipart'}
		];
		for(let i =0;i<this.images.length;i++) {
			fetch("i/"+this.images[i].id+".json")
				.then(r => r.json())
				.then(json=>{
					let image = Object.assign({}, this.images[i], json);
					
					// prepare object here

					image.loaded = true;
					this.images.splice(i, 1, image); 
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