<template>
	<div id="field">
	</div>
</template>

<script>
	
import Viewport from "pixi-viewport";
import Tinycolor from "tinycolor2";
import {TweenLite} from "gsap";

export default {
	props: {
		palette: {
			type: Array,
			default: function () { return []; }
		},
		field: {
			type:Object,
			default: function () { return {}; }	
		},
		selectedColor: {
			type:Number,
			default:0
		}
	},
	mounted: function () {
	},
	methods: {
		render:function () {
			let T = this;
			let type = "WebGL"
			if(!PIXI.utils.isWebGLSupported()){
			  type = "canvas"
			}
			
			let app = new PIXI.Application({ 
			    width: 256, 
			    height: 256,                       
			    antialias: true, 
			    transparent: false, 
			    resolution: 1
			  }
			);

			app.renderer.backgroundColor = 0xffffff;
			app.renderer.view.style.position = "absolute";
			app.renderer.view.style.display = "block";
			app.renderer.autoResize = true;
			app.renderer.resize(window.innerWidth, window.innerHeight);

			document.getElementById('field').appendChild(app.view);

			var colors = [],
				grayColors = [],
				lightGrayColors = [],
				darkGrayColors = [];

			var coloredPixelsCount = 0,
				pixelsToColorCount = 0;

			var rectSize = 50;

			// create viewport
			var viewport = new Viewport({
			    screenWidth: window.innerWidth,
			    screenHeight: window.innerHeight,
			    worldWidth: this.field.width*rectSize,
			    worldHeight: this.field.height*rectSize
			});

			app.stage.addChild(viewport);

			viewport
			    .drag() // enable drag
			    .wheel() // enable zoom on mouse wheel
			    .pinch() // enable zoom on pinch
			    .bounce() // ??
			    .decelerate() // ??
			    .clamp({}) // don't allow to drag outside
			    .clampZoom({ // don't allow to zoom too much
			    	minWidth:400,
			    	maxWidth:this.field.width*rectSize*1.5
			    })
			    .fit();

			
			// check regulary if scale is large enough to change view
			// @todo clearInterval on destroy
			setInterval(function () {
				if (viewport.transform.scale._x>0.5) {
					background.visible = false;
					backgroundZoomed.visible = true;
				} else {
					background.visible = true;
					backgroundZoomed.visible = false;
				}
			},100);



			// generate grayscale palettes

			for (var i=0;i<this.palette.length;i++) {
						
				let r = this.palette[i]._r/255,
					g = this.palette[i]._g/255,
					b = this.palette[i]._b/255;
			
				colors.push(PIXI.utils.rgb2hex([r, g, b]));
				
				//desaturate 
				r = (r+g+b)/3;
				grayColors.push(PIXI.utils.rgb2hex([r/2+0.5, r/2+0.5, r/2+0.5]));
				
				//lighten
				r = 1-((1-r)/5)
				lightGrayColors.push(PIXI.utils.rgb2hex([r, r, r]));
				
				//darken
				r = r - 0.5;
				darkGrayColors.push(PIXI.utils.rgb2hex([r, r, r]));
			}

			// draw fields

			var background = new PIXI.Graphics();
			var backgroundZoomed = new PIXI.Graphics();
			var front = new PIXI.Graphics();
			for (var y=0;y<this.field.height;y++) {
				for (var x=0;x<this.field.width;x++) {

					if ( this.field.data[y][x] === -1 ) continue;
					
					pixelsToColorCount ++;

					backgroundZoomed.beginFill(lightGrayColors[this.field.data[y][x]]);
					backgroundZoomed.drawRect(x*rectSize,y*rectSize,rectSize-1,rectSize-1);
					backgroundZoomed.endFill();
					let txt = new PIXI.Text(this.field.data[y][x]+1, {fontFamily : 'Verdana', fontSize: 24, fill : darkGrayColors[this.field.data[y][x]], align : 'center'});
					txt.x = (x+0.5)*rectSize-txt.width/2;
					txt.y = (y+0.5)*rectSize-txt.height/2;
					backgroundZoomed.addChild(txt);
					background.beginFill(grayColors[this.field.data[y][x]]);
					background.drawRect(x*rectSize,y*rectSize,rectSize,rectSize);
					background.endFill();
				}
			}

			// now we can cache rendered maps

			background.cacheAsBitmap = true;
			backgroundZoomed.cacheAsBitmap = true;

			backgroundZoomed.visible = false;
			viewport.addChild(background);
			viewport.addChild(backgroundZoomed);
			viewport.addChild(front);

			var lastColoredPixelX = -1,
				lastColoredPixelY = -1,
				lastColoredPixelTime = -1000;
			var fillPixel = function(x, y, flood = false, floodColor = null) {
				if (x<0||y<0||x>=T.field.width||y>=T.field.height) return;
				if (T.field.data[y][x] === -1) return;
				if (T.field.data[y][x] !== T.selectedColor) {
					if (!flood) return;
					if (T.field.data[y][x] !== floodColor) return;
				}

				if (!flood) {
					var newColoredPixelTime = Date.now();
					if ((newColoredPixelTime - lastColoredPixelTime < 300) && (lastColoredPixelX===x) && (lastColoredPixelY===y)) {
						floodColor = T.selectedColor;
						var floodTimeout = setTimeout(function () {
							fillPixel(x-1, y, true, floodColor);
							fillPixel(x, y-1, true, floodColor);
							fillPixel(x+1, y, true, floodColor);
							fillPixel(x, y+1, true, floodColor);
						},100);
					}
					lastColoredPixelTime = newColoredPixelTime;
					lastColoredPixelX = x;
					lastColoredPixelY = y;
				}

				if (T.field.colored[y][x] === 1) return;

				if (flood) {
					var floodTimeout = setTimeout(function () {
						fillPixel(x-1, y, true, floodColor);
						fillPixel(x, y-1, true, floodColor);
						fillPixel(x+1, y, true, floodColor);
						fillPixel(x, y+1, true, floodColor);
					},100);
				}


				T.field.colored[y][x] = 1;
				coloredPixelsCount ++;

				var endFill = function () {

					front.cacheAsBitmap = false;
			
					front.beginFill(colors[T.field.data[y][x]]);
					front.drawRect(x*rectSize,y*rectSize,rectSize,rectSize);
					front.endFill();
			
					front.cacheAsBitmap = true;
			
					viewport.removeChild(clip);
					viewport.removeChild(mask);

					if (coloredPixelsCount >= pixelsToColorCount) {
						console.log('Congratulations! Level complete!');
					}

				}
				var clip = new PIXI.Graphics();
				var mask = new PIXI.Graphics();

				
				mask.isMask = true;
				mask.beginFill(colors[T.field.data[y][x]]);
				mask.drawRect(x*rectSize,y*rectSize,rectSize,rectSize);
				mask.x = mask.y = 0;
				mask.endFill();

				viewport.addChild(mask);

				clip.beginFill(colors[T.field.data[y][x]]);
				clip.drawCircle( 0, 0, rectSize);
				clip.endFill();
				clip.x = (x+0.5) * rectSize;
				clip.y = (y+0.5) * rectSize;
				clip.scale = new PIXI.Point(0,0);
				clip.mask = mask;
				
				viewport.addChild(clip);
				
				TweenLite.to(clip.scale, 0.7, {x:1,y:1,onComplete:endFill});
			}

			var tap = function (e) {
				let point = e.data.getLocalPosition(viewport);
				let x = Math.floor(point.x/rectSize);
				let y = Math.floor(point.y/rectSize);
				if (x >= 0 && x < T.field.width && y >=0 && y < T.field.height) {
					fillPixel(x,y);
				}
			};

			viewport.on('tap', tap);
			viewport.on('click', tap);
		}
	}
}

</script>

<style>
	
</style>