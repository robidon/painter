<template>
	<div class="GameContainer" ref="image">
	</div>
</template>

<script>
	
import Viewport from "pixi-viewport";
import Tinycolor from "tinycolor2";
import {TweenLite} from "gsap";
Tinycolor.prototype.toNumber = function() {
        return (Math.round(this._r)<<16) + (Math.round(this._g)<<8) + (Math.round(this._b));
}
export default {
	props: {
		palette: {
			type: Array,
			default: function () { return []; }
		},
		image: {
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
		render:function (clientWidth, clientHeight) {
			setTimeout(()=>{
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
				var container = this.$refs['image'];
				app.renderer.resize(clientWidth, clientHeight);

				container.appendChild(app.view);

				var coloredPixelsCount = 0,
					pixelsToColorCount = 0;

				var rectSize = 50;

				// create viewport
				var viewport = new Viewport({
				    screenWidth: clientWidth,
				    screenHeight: clientHeight,
				    worldWidth: this.image.width*rectSize,
				    worldHeight: this.image.height*rectSize
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
				    	maxWidth:this.image.width*rectSize*1.5
				    })
				    .fit();

				
				// check regulary if scale is large enough to change view
				// @todo clearInterval on destroy
				setInterval(function () {
					if (viewport.transform.scale._x>0.3) {
						background.visible = false;
						backgroundZoomed.visible = true;
					} else {
						background.visible = true;
						backgroundZoomed.visible = false;
					}
				},100);


				// draw images

				//var background = new PIXI.Graphics();

				var basetexture = new PIXI.BaseTexture(this.image.canvases.light, PIXI.SCALE_MODES.NEAREST, 1/rectSize);
				var texture = new PIXI.Texture(basetexture);
				var background = new PIXI.Sprite(texture);
				var bckZoomedSprite = new PIXI.Sprite(texture);

				//background.
				var backgroundZoomed = new PIXI.Graphics();
				backgroundZoomed.addChild(bckZoomedSprite);
				var front = new PIXI.Graphics();
				for (var y=0;y<this.image.height;y++) {
					for (var x=0;x<this.image.width;x++) {

						if ( this.image.pixels.clean[x][y]-1 === -1 ) continue;
						
						pixelsToColorCount ++;

						let txt = new PIXI.Text(this.image.pixels.clean[x][y], {fontFamily : 'Verdana', fontSize: 24, fill : this.image.palettes.dark[this.image.pixels.clean[x][y]-1].toNumber(), align : 'center'});
						txt.x = (x+0.5)*rectSize-txt.width/2;
						txt.y = (y+0.5)*rectSize-txt.height/2;
						backgroundZoomed.addChild(txt);

					}
				}

				// now we can cache rendered maps
				backgroundZoomed.cacheAsBitmap = true;

				viewport.addChild(background);
				viewport.addChild(backgroundZoomed);
				viewport.addChild(front);

				backgroundZoomed.visible = false;

				var lastColoredPixelX = -1,
					lastColoredPixelY = -1,
					lastColoredPixelTime = -1000;

				var fillPixel = function(x, y, flood = false, floodColor = null) {
					if (x<0||y<0||x>=T.image.width||y>=T.image.height) return;
					if (T.image.pixels.clean[x][y]-1 === -1) return;
					if (T.image.pixels.clean[x][y]-1 !== T.selectedColor) {
						if (!flood) return;
						if (T.image.pixels.clean[x][y]-1 !== floodColor) return;
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
					
					if (T.image.pixels.colored[x][y] === 1) return;
					
					if (flood) {
						var floodTimeout = setTimeout(function () {
							fillPixel(x-1, y, true, floodColor);
							fillPixel(x, y-1, true, floodColor);
							fillPixel(x+1, y, true, floodColor);
							fillPixel(x, y+1, true, floodColor);
						},100);
					}



					T.image.pixels.colored[x][y] = 1;
					coloredPixelsCount ++;

					var endFill = function () {

						front.cacheAsBitmap = false;
				
						front.beginFill(T.image.palettes.colors[T.image.pixels.clean[x][y]-1].toNumber());
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
					mask.beginFill(T.image.palettes.colors[T.image.pixels.clean[x][y]-1].toNumber());
					mask.drawRect(x*rectSize,y*rectSize,rectSize,rectSize);
					mask.x = mask.y = 0;
					mask.endFill();

					viewport.addChild(mask);

					clip.beginFill(T.image.palettes.colors[T.image.pixels.clean[x][y]-1].toNumber());
					clip.drawCircle(0, 0, rectSize);
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
					if (x >= 0 && x < T.image.width && y >=0 && y < T.image.height) {
						fillPixel(x,y);
					}
				};

				viewport.on('tap', tap);
				viewport.on('click', tap);
				this.$emit('render-complete');
			},1);
		}
	}
}

</script>

<style>
	.GameContainer {
		position:absolute;
		left:0px;top:0px;right:0px;bottom:70px;
	}
</style>