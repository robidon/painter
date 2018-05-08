var Viewport = require('pixi-viewport');
var tinycolor = require("tinycolor2");

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

var map = [],
	colors = [],
	grayColors = [],
	lightGrayColors = [],
	darkGrayColors = [];

var mapWidth = 30,
	mapHeight = 50;
var colorsCount = 10;
var rectSize = 50;

// create viewport
var viewport = new Viewport({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    worldWidth: mapWidth*rectSize,
    worldHeight: mapHeight*rectSize
});

app.stage.addChild(viewport);
// activate plugins
viewport
    .drag()
    .wheel()
    .pinch()
    .bounce()
    .decelerate()    
    .clampZoom({
    	minWidth:300,
    	maxWidth:mapWidth*rectSize
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

for (var y=0;y<mapHeight;y++) {
	map.push([]);
	for (var x=0;x<mapWidth;x++) {
		map[y].push(Math.floor(Math.random()*colorsCount));
	}
}
for (var i=0;i<colorsCount;i++) {
	let randColor = tinycolor.random();
	colors.push(PIXI.utils.rgb2hex([randColor._r/255, randColor._g/255, randColor._b/255]));
	randColor = randColor.desaturate(100);
	grayColors.push(PIXI.utils.rgb2hex([randColor._r/255, randColor._g/255, randColor._b/255]));
	randColor._b = 255-((1-randColor._b/255)*50);
	randColor._r = randColor._g = randColor._b;
	lightGrayColors.push(PIXI.utils.rgb2hex([randColor._r/255, randColor._g/255, randColor._b/255]));
	randColor._b = randColor._b - 145;
	randColor._r = randColor._g = randColor._b;
	darkGrayColors.push(PIXI.utils.rgb2hex([randColor._r/255, randColor._g/255, randColor._b/255]));
}
var gr = new PIXI.Graphics();
var grZoomed = new PIXI.Graphics();
for (var y=0;y<mapHeight;y++) {
	for (var x=0;x<mapWidth;x++) {
		grZoomed.beginFill(lightGrayColors[map[y][x]]);
		grZoomed.drawRect(x*rectSize,y*rectSize,rectSize-1,rectSize-1);
		grZoomed.endFill();
		let txt = new PIXI.Text(map[y][x]+1, {fontFamily : 'Arial', fontSize: 24, fill : darkGrayColors[map[y][x]], align : 'center'});
		txt.x = (x+0.5)*rectSize-txt.width/2;
		txt.y = (y+0.5)*rectSize-txt.height/2;
		grZoomed.addChild(txt);
		gr.beginFill(grayColors[map[y][x]]);
		gr.drawRect(x*rectSize,y*rectSize,rectSize,rectSize);
		gr.endFill();
	}
}
gr.cacheAsBitmap = true;
grZoomed.cacheAsBitmap = true;

grZoomed.visible = false;
viewport.addChild(gr);
viewport.addChild(grZoomed);

// add a red box
var sprite = viewport.addChild(new PIXI.Sprite(PIXI.Texture.WHITE));
sprite.tint = 0xff0000;
sprite.width = sprite.height = 50
sprite.position.set(50, 50);