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
let checkZoomInterval = 0;
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
		stop: function () {
			
		},
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
				    antialias: false, 
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
				clearInterval(checkZoomInterval);
				checkZoomInterval = setInterval(function () {
					if (viewport.transform.scale._x>0.3) {
						if (viewport.getChildIndex(background)>viewport.getChildIndex(backgroundZoomed)) {
							viewport.swapChildren(background, backgroundZoomed);
						}
					} else {
						if (viewport.getChildIndex(background)<viewport.getChildIndex(backgroundZoomed)) {
							viewport.swapChildren(background, backgroundZoomed);
						}
					}
				},100);


				// draw images
				var basetexture = new PIXI.BaseTexture(this.image.canvases.light, PIXI.SCALE_MODES.NEAREST, 1/rectSize);
				var texture = new PIXI.Texture(basetexture);
				var background = new PIXI.Sprite(texture);
				var bckZoomedSprite = new PIXI.Sprite(texture);

				var backgroundZoomed = new PIXI.Graphics();
				backgroundZoomed.addChild(bckZoomedSprite);
				var front = new PIXI.Graphics();
				for (var y=0;y<this.image.height;y++) {
					for (var x=0;x<this.image.width;x++) {

						if (this.image.pixels.colored[x][y]) {
							front.beginFill(this.image.palettes.colors[this.image.pixels.clean[x][y]-1].toNumber());
							front.drawRect(x*rectSize,y*rectSize,rectSize,rectSize);
							front.endFill();							
						}
						
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


				var lastColoredPixelX = -1,
					lastColoredPixelY = -1,
					lastColoredPixelTime = -1000,
					pixelsToFill = 0;

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

					pixelsToFill++;

					T.image.pixels.colored[x][y] = 1;
					coloredPixelsCount ++;

					var endFill = function () {

						front.cacheAsBitmap = false;
				
						front.beginFill(T.image.palettes.colors[T.image.pixels.clean[x][y]-1].toNumber());
						front.drawRect(x*rectSize,y*rectSize,rectSize,rectSize);
						front.endFill();

						pixelsToFill--;

						if (pixelsToFill<=0) {
							front.cacheAsBitmap = true;
						}

						viewport.removeChild(clip);
						viewport.removeChild(mask);

						T.$emit('mark-colored',{x:x,y:y});

						if (coloredPixelsCount >= pixelsToColorCount) {
							T.$emit("level-complete");
						}

					}
					var clip = new PIXI.Graphics();
					var mask = new PIXI.Graphics();

					
					mask.isMask = true;
					mask.beginFill(T.image.palettes.colors[T.image.pixels.clean[x][y]-1].toNumber());
					mask.drawCircle(0, 0, rectSize);
					mask.endFill();
					mask.x = (x+0.5) * rectSize;
					mask.y = (y+0.5) * rectSize;
					mask.scale = new PIXI.Point(0,0);
					
					viewport.addChild(mask);

					clip.beginFill(T.image.palettes.colors[T.image.pixels.clean[x][y]-1].toNumber());
					clip.drawRect(0,0,rectSize,rectSize);
					clip.x = x*rectSize;
					clip.y = y*rectSize;
					clip.endFill();
					clip.mask = mask;

					viewport.addChild(clip);
					
					TweenLite.to(mask.scale, 0.7, {x:1,y:1,onComplete:endFill});
				}

				var tap = function (point) {
					let x = Math.floor(point.x/rectSize);
					let y = Math.floor(point.y/rectSize);
					if (x >= 0 && x < T.image.width && y >=0 && y < T.image.height) {
						fillPixel(x,y);
					}
				};

				var tapPoint;
				viewport.on('pointerdown', function (e) {
					tapPoint = {x:e.data.global.x, y:e.data.global.y};
				});
				viewport.on('pointerup', function (e) {
					let newPoint = e.data.global;
					if (typeof(tapPoint)!="undefined" && Math.abs(tapPoint.x - newPoint.x)<10 && Math.abs(tapPoint.y - newPoint.y)<10) {
						tap(e.data.getLocalPosition(viewport));
					}
					tapPoint = undefined;
				});

				app.render();

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