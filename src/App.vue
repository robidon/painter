<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>
import _ from 'underscore';
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueLocalStorage from 'vue-localstorage';
import Game from './Components/Game.vue'
import ImagesMenu from './Components/ImagesMenu.vue'
import Tinycolor from "tinycolor2";
import Buefy from 'buefy';
import 'buefy/lib/buefy.css';

import "fetch-polyfill";

Vue.use(VueRouter);
Vue.use(VueLocalStorage);
Vue.use(Buefy);

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
			storedData:{},
			selectedImageIndex: -1,
			images: window.globals.images,
			imageNames: []
		}
	},
	localStorage: {
		storedData: {
			type:Object,
			default:{}
		}
	},
	created: function () {

		this.images.push({id:'Fish/Betta-PNG-Photos'});
		this.images.push({id:'Cats/cat'});
		this.images.push({id:'Cartoons/Donkey-Kong-PNG-Photos'});
		this.images.push({id:'Animals/Leopard-PNG-Free-Download'});
		this.images.push({id:'Animals/Leopard-Transparent-Background'});
		this.images.push({id:'Gothic/Pile-of-Skulls-PNG-Clipart'});
		this.images.push({id:'Emoji/alien-emoji-png-transparent-icon-2-clipart'});
		this.images.push({id:'Emoji/AmbulanceEmoji'});
		this.images.push({id:'Emoji/BirdEmoji'});
		this.images.push({id:'Emoji/Death'});
		this.images.push({id:'Emoji/EmojiBlitzFlounder'});
		this.images.push({id:'Emoji/FireEmoji_0'});
		this.images.push({id:'Emoji/FiretruckEmoji'});
		this.images.push({id:'Emoji/GemEmoji'});
		this.images.push({id:'Emoji/GunEmoji'});
		this.images.push({id:'Emoji/if_angry_1325170'});
		this.images.push({id:'Emoji/if_love_1325176'});
		this.images.push({id:'Emoji/if_shy_1325169'});
		this.images.push({id:'Emoji/if_wink_1325171'});
		this.images.push({id:'Emoji/LipsEmoji'});
		this.images.push({id:'Emoji/LoveEmoji_0'});
		this.images.push({id:'Emoji/Luck'});
		this.images.push({id:'Emoji/PIEmoji'});
		this.images.push({id:'Emoji/RaceCarEmoji'});
		this.images.push({id:'Emoji/SunEmoji'});
		this.images.push({id:'Emoji/TVEmoji'});

		this.storedData = this.$localStorage.storedData;

		for(let i =0;i<this.images.length;i++) {
			this.images[i].loaded = false;
			fetch("i/"+this.images[i].id+".json")
				.then(r => r.json())
				.then(json=>{
					this.setupImage(i, json);
				});
		}

		this.$router.push('/imagesmenu');

		this.$router.app.$on('save-image', this.saveState);

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
				coloredPixelsCount:0,
				pixelsToColorCount:0,
				started:false,
				palettes:{
					colors:[],
					gray:[],
					light:[],
					dark:[],
					totals:[],
					colored:[]
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
				image.palettes.totals.push(0);
				image.palettes.colored.push(0);
			}

			for (var x=0; x<image.width; x++) {
				image.pixels.clean.push([]);
				image.pixels.colored.push([]);
				for (var y=0; y<image.height; y++) {
					image.pixels.clean[x].push(imageData.pixels[y*image.width+x]);
					if (image.pixels.clean[x][y]) 
						image.palettes.totals[image.pixels.clean[x][y]-1]++;
					if (imageData.colored && typeof(imageData.colored[y*image.width+x])!=="undefined") {
						image.pixels.colored[x].push(imageData.pixels[y*image.width+x]);
					} else {
						image.pixels.colored[x].push(0);
					}
				}
			}

			if('images' in this.storedData) {
				for(var i=0;i<this.storedData.images.length;i++) {
					if (this.storedData.images[i].id===image.id) {
						image.pixels.colored = this.storedData.images[i].pixels.colored.slice();
						break;
					}
				}
			}
			
			var lightCanvas = document.createElement('canvas');
			lightCanvas.width = image.width;
			lightCanvas.height = image.height;
			var lightContext = lightCanvas.getContext('2d');

			var imageData = lightContext.createImageData(image.width,image.height);
			this.fillImageDataWithPalette(imageData, image.pixels.clean, image.palettes.light);
			
			lightContext.putImageData(imageData,0,0);
			image.canvases.light = lightCanvas;

			this.updateColoredCanvas(image);

			this.images.splice(imageIndex, 1, image);
		},
		fillImageDataWithPalette: function(imageData, pixels, palette) {
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
		},
		updateColoredCanvas:function (image) {
			var coloredCanvas = document.createElement('canvas');
			coloredCanvas.width = image.width;
			coloredCanvas.height = image.height;
			var coloredContext = coloredCanvas.getContext('2d');
			var cimageData = coloredContext.createImageData(image.width,image.height);
			var cpixels = [];
			var coloredPixelsCount = 0;
			var pixelsToColorCount = 0;
			image.palettes.colored = Array(image.palettes.colors.length).fill(0);
			for(var x=0;x<image.width;x++) {
				cpixels.push([]);
				for(var y=0;y<image.height;y++) {
					cpixels[x].push(image.pixels.colored[x][y]*image.pixels.clean[x][y]);
					if (image.pixels.clean[x][y]) pixelsToColorCount++;
					if (image.pixels.colored[x][y]) {
						if (!image.started) {
							image.started = true;
						}
						coloredPixelsCount++;
						image.palettes.colored[image.pixels.clean[x][y]-1]++;
					}
				}
			}
			image.coloredPixelsCount = coloredPixelsCount;
			image.pixelsToColorCount = pixelsToColorCount;
			this.fillImageDataWithPalette(cimageData, cpixels, image.palettes.colors);
			coloredContext.putImageData(cimageData,0,0);
			image.canvases.colored = coloredCanvas;
		},
		saveState:function (id) {
			console.log('saveState',id);
			this.storedData.images = [];
			for (var i=0;i<this.images.length;i++) {
				if (this.images[i].id==id) {
					this.updateColoredCanvas(this.images[i]);
					this.$router.app.$emit('update-image', id);
				}
				this.storedData.images.push({
					id:this.images[i].id,
					pixels:{
						colored:this.images[i].pixels.colored.slice()
					}
				})
			}
			this.$localStorage.storedData = _.extend({},this.storedData);
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