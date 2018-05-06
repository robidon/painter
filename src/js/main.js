var $ = require('jquery');
var _ = require('underscore');
var PIXI = require('pixi.js');
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
    .decelerate()
    .bounce();

// add a red box
var sprite = viewport.addChild(new PIXI.Sprite(PIXI.Texture.WHITE));
sprite.tint = 0xff0000;
sprite.width = sprite.height = 100
sprite.position.set(100, 100);