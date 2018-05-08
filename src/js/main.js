var Viewport = require('pixi-viewport');
var tinycolor = require("tinycolor2");
import {TweenLite} from "gsap";

let type = "WebGL"
if(!PIXI.utils.isWebGLSupported()){
  type = "canvas"
}

PIXI.utils.sayHello(type)

//Create a Pixi Application
let app = new PIXI.Application({ 
    width: 256, 
    height: 256,                       
    antialias: true, 
    transparent: false, 
    resolution: 1
  }
);

app.renderer.backgroundColor = 0xffffff;//0x061639;
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);

document.body.appendChild(app.view);

var field = [],
	colors = [],
	grayColors = [],
	lightGrayColors = [],
	darkGrayColors = [];

var fieldWidth = 30,
	fieldHeight = 50;
var colorsCount = 10;
var rectSize = 50;

// create viewport
var viewport = new Viewport({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    worldWidth: fieldWidth*rectSize,
    worldHeight: fieldHeight*rectSize
});

app.stage.addChild(viewport);
// activate plugins
viewport
    .drag()
    .wheel()
    .pinch()
    .bounce()
    .decelerate()
    .clamp({})    
    .clampZoom({
    	minWidth:400,
    	maxWidth:fieldWidth*rectSize*1.5
    })
    .fit();

setInterval(function () {
	if (viewport.transform.scale._x>0.5) {
		//sprite.tint = sprite.
		gr.visible = false;
		grZoomed.visible = true;
	} else {
		gr.visible = true;
		grZoomed.visible = false;
	}
},100);
// @todo clearInterval on destroy

for (var y=0;y<fieldHeight;y++) {
	field.push([]);
	for (var x=0;x<fieldWidth;x++) {
		field[y].push(Math.floor(Math.random()*colorsCount));
	}
}
for (var i=0;i<colorsCount;i++) {
	let randColor = tinycolor.random();
	colors.push(PIXI.utils.rgb2hex([randColor._r/255, randColor._g/255, randColor._b/255]));
	randColor = randColor.desaturate(100);
	grayColors.push(PIXI.utils.rgb2hex([randColor._r/255/2+0.5, randColor._g/255/2+0.5, randColor._b/255/2+0.5]));
	randColor._b = 255-((1-randColor._b/255)*50);
	randColor._r = randColor._g = randColor._b;
	lightGrayColors.push(PIXI.utils.rgb2hex([randColor._r/255, randColor._g/255, randColor._b/255]));
	randColor._b = randColor._b - 145;
	randColor._r = randColor._g = randColor._b;
	darkGrayColors.push(PIXI.utils.rgb2hex([randColor._r/255, randColor._g/255, randColor._b/255]));
}
var gr = new PIXI.Graphics();
var grZoomed = new PIXI.Graphics();
var front = new PIXI.Graphics();
for (var y=0;y<fieldHeight;y++) {
	for (var x=0;x<fieldWidth;x++) {
		grZoomed.beginFill(lightGrayColors[field[y][x]]);
		grZoomed.drawRect(x*rectSize,y*rectSize,rectSize-1,rectSize-1);
		grZoomed.endFill();
		let txt = new PIXI.Text(field[y][x]+1, {fontFamily : 'Roboto', fontSize: 24, fill : darkGrayColors[field[y][x]], align : 'center'});
		txt.x = (x+0.5)*rectSize-txt.width/2;
		txt.y = (y+0.5)*rectSize-txt.height/2;
		grZoomed.addChild(txt);
		gr.beginFill(grayColors[field[y][x]]);
		gr.drawRect(x*rectSize,y*rectSize,rectSize,rectSize);
		gr.endFill();
	}
}
gr.cacheAsBitmap = true;
grZoomed.cacheAsBitmap = true;

grZoomed.visible = false;
viewport.addChild(gr);
viewport.addChild(grZoomed);
viewport.addChild(front);

var fillPixel = function(x,y) {
	var endFill = function () {
		front.beginFill(colors[field[y][x]]);
		front.drawRect(x*rectSize,y*rectSize,rectSize,rectSize);
		front.endFill();
		viewport.removeChild(clip);
	}
	var clip = new PIXI.Graphics();
	var mask = new PIXI.Graphics();
	viewport.addChild(mask);
	mask.isMask = true;
	mask.beginFill(colors[field[y][x]]);
	mask.drawRect(x*rectSize,y*rectSize,rectSize,rectSize);//(-0.5*rectSize,-0.5*rectSize,rectSize,rectSize);
	mask.endFill();

	clip.beginFill(colors[field[y][x]]);
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
	if (x >= 0 && x < fieldWidth && y >=0 && y < fieldHeight) {
		fillPixel(x,y);
	}
};

viewport.on('tap', tap);
viewport.on('click', tap);

// add a red box
var sprite = viewport.addChild(new PIXI.Sprite(PIXI.Texture.WHITE));
sprite.tint = 0xff0000;
sprite.width = sprite.height = 50
sprite.position.set(50, 50);
