var Viewport = require('pixi-viewport');

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

app.renderer.backgroundColor = 0x061639;
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);

document.body.appendChild(app.view);

// create viewport
var viewport = new Viewport({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    worldWidth: 1000,
    worldHeight: 1000
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
    	minWidth:100,
    	maxWidth:1000
    })
    .fit();
    // .on('pinch-end', updateView)
    // .on('wheel', updateView);

setInterval(function () {
	if (viewport.transform.scale._x>1) {
		//sprite.tint = sprite.
		gr.visible = false;
		grZoomed.visible = true;
	} else {
		gr.visible = true;
		grZoomed.visible = false;
	}
},100);

var map = [];
var colors = [];
var mapWidth = mapHeight = 100;
var colorsCount = 10;
var rectSize = 10;
for (var y=0;y<mapHeight;y++) {
	map.push([]);
	for (var x=0;x<mapWidth;x++) {
		map[y].push(Math.round(Math.random()*colorsCount));
	}
}
for (var i=0;i<colorsCount;i++) {
	colors.push(((1<<24)*Math.random()|0));
}
var gr = new PIXI.Graphics();
var grZoomed = new PIXI.Graphics();
for (var y=0;y<mapHeight;y++) {
	for (var x=0;x<mapWidth;x++) {
		grZoomed.lineStyle(1, colors[map[y][x]], 1);
		grZoomed.drawRect(x*rectSize,y*rectSize,rectSize-1,rectSize-1);
		gr.beginFill(colors[map[y][x]]);
		gr.drawRect(x*rectSize,y*rectSize,rectSize,rectSize);
		gr.endFill();
	}
}
grZoomed.visible = false;
viewport.addChild(gr);
viewport.addChild(grZoomed);

// add a red box
var sprite = viewport.addChild(new PIXI.Sprite(PIXI.Texture.WHITE));
sprite.tint = 0xff0000;
sprite.width = sprite.height = 50
sprite.position.set(50, 50);