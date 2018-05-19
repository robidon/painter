<template>
	<div id="app">
		<!--<ImagesMenu v-if="selectedImageIndex === -1" v-bind:images="images" v-on:select="select"></ImagesMenu>
		<Game v-if="selectedImageIndex !== -1" v-bind:image="images[selectedImageIndex]"></Game>-->
		<router-view></router-view>
	</div>
</template>

<script>
import Vue from 'vue';
import VueRouter from 'vue-router';
import Game from './Components/Game.vue'
import ImagesMenu from './Components/ImagesMenu.vue'
import Tinycolor from "tinycolor2";

Vue.use(VueRouter);

const routes = [
  { name:'imagesmenu', path: '/imagesmenu', component: ImagesMenu },
  { name:'game', path: '/game/:id', component: Game }
];

const router = new VueRouter({
  routes
});

export default {
	router:router,
	data: function () {
		return {
			selectedImageIndex: -1,
			images: window.globals.images,
			imageNames: []
		}
	},
	created: function () {

		this.images.push({id:'Betta-PNG-Photos'});
		this.images.push({id:'cat'});
		this.images.push({id:'Donkey-Kong-PNG-Photos'});
		this.images.push({id:'Leopard-PNG-Free-Download'});
		this.images.push({id:'Leopard-Transparent-Background'});
		this.images.push({id:'Pile-of-Skulls-PNG-Clipart'});
		
		for(let i =0;i<this.images.length;i++) {
			this.images[i].loaded = false;
			fetch("i/"+this.images[i].id+".json")
				.then(r => r.json())
				.then(json=>{
					this.setupImage(i, json);
				});
		}

		this.$router.push('/imagesmenu');

	},
	methods:{
		select:function(index) {
			this.selectedImageIndex = index;
		},
		setupImage:function(imageIndex, imageData) {
			
			let image = {
				id:this.images[imageIndex].id,
				loaded:true,
				rawdata:imageData,
				width:imageData.width,
				height:imageData.height,
				palettes:{
					colors:[],
					gray:[],
					light:[],
					dark:[]
				},
				pixels:{
					clean:[],
					colored:[]
				},
				canvases: {
					colors:{},
					light:{},
					colored:{}
				}
			};
			
			for (var i = 0;i<imageData.palette.length;i++) {
				var color = Tinycolor(imageData.palette[i]);
				image.palettes.colors.push(color);
				var g = (color.toRgb().r + color.toRgb().g + color.toRgb().b)/3;
				image.palettes.gray.push(Tinycolor({r:g, b:g, g:g, a:color.toRgb().a}));
				var lg = g = 255-((255-g)/5)
				image.palettes.light.push(Tinycolor({r:lg, b:lg, g:lg, a:color.toRgb().a}));
				var dg = lg - 150;
				image.palettes.dark.push(Tinycolor({r:dg, b:dg, g:dg, a:color.toRgb().a}));
			}
			for (var x=0; x<image.width; x++) {
				image.pixels.clean.push([]);
				image.pixels.colored.push([]);
				for (var y=0; y<image.height; y++) {
					image.pixels.clean[x].push(imageData.pixels[y*image.width+x]);
					if (imageData.colored && typeof(imageData.colored[y*image.width+x])!=="undefined") {
						image.pixels.colored[x].push(imageData.pixels[y*image.width+x]);
					} else {
						image.pixels.colored[x].push(0);
					}
				}
			}
			

			var shadowCanvas = document.createElement('canvas');
			shadowCanvas.width = image.width;
			shadowCanvas.height = image.height;
			var context = shadowCanvas.getContext('2d');

			var imageData = context.createImageData(image.width,image.height);
			var fillImageDataWithPalette = function(imageData, pixels, palette) {
				for (var x=0; x<imageData.width; x++) {
					for(var y=0; y<imageData.height; y++) {
						if(pixels[x][y] == 0) {
							imageData.data.fill(0,(y*imageData.width+x)*4,(y*imageData.width+x)*4+3);
							continue;							
						}
						var color = palette[pixels[x][y]-1].toRgb();
						imageData.data[(y*imageData.width+x)*4] = color.r;
						imageData.data[(y*imageData.width+x)*4+1] = color.g;
						imageData.data[(y*imageData.width+x)*4+2] = color.b;
						imageData.data[(y*imageData.width+x)*4+3] = color.a*255;
					}
				}
			}
			fillImageDataWithPalette(imageData, image.pixels.clean, image.palettes.light)
			
			context.putImageData(imageData,0,0);
			image.canvases.light = shadowCanvas;
			this.images.splice(imageIndex, 1, image);
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