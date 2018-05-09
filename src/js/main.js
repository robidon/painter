var Viewport = require('pixi-viewport');
var tinycolor = require("tinycolor2");
import {TweenLite} from "gsap";


function initGame() {
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

	app.renderer.backgroundColor = 0xffffff;
	app.renderer.view.style.position = "absolute";
	app.renderer.view.style.display = "block";
	app.renderer.autoResize = true;
	app.renderer.resize(window.innerWidth, window.innerHeight);

	document.body.appendChild(app.view);

	var field = [],
		fieldColored = [],
		colors = [],
		grayColors = [],
		lightGrayColors = [],
		darkGrayColors = [];

	var coloredPixelsCount = 0,
		pixelsToColorCount = 0,
		fieldWidth = 5,
		fieldHeight = 5;
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

	viewport
	    .drag() // enable drag
	    .wheel() // enable zoom on mouse wheel
	    .pinch() // enable zoom on pinch
	    .bounce() // ??
	    .decelerate() // ??
	    .clamp({}) // don't allow to drag outside
	    .clampZoom({ // don't allow to zoom too much
	    	minWidth:400,
	    	maxWidth:fieldWidth*rectSize*1.5
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

	// generate random pixel field
	// @todo remove this

	for (var y=0;y<fieldHeight;y++) {
		field.push([]);
		fieldColored.push([]);
		for (var x=0;x<fieldWidth;x++) {
			let color = Math.floor(Math.random()*colorsCount);
			field[y].push( (Math.random()>0.5) ? color : -1 );
			fieldColored[y].push(0);
		}
	}

	// generate grayscale palettes

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

	// draw fields

	var background = new PIXI.Graphics();
	var backgroundZoomed = new PIXI.Graphics();
	var front = new PIXI.Graphics();
	for (var y=0;y<fieldHeight;y++) {
		for (var x=0;x<fieldWidth;x++) {

			if ( field[y][x] === -1 ) continue;
			
			pixelsToColorCount ++;

			backgroundZoomed.beginFill(lightGrayColors[field[y][x]]);
			backgroundZoomed.drawRect(x*rectSize,y*rectSize,rectSize-1,rectSize-1);
			backgroundZoomed.endFill();
			let txt = new PIXI.Text(field[y][x]+1, {fontFamily : 'Verdana', fontSize: 24, fill : darkGrayColors[field[y][x]], align : 'center'});
			txt.x = (x+0.5)*rectSize-txt.width/2;
			txt.y = (y+0.5)*rectSize-txt.height/2;
			backgroundZoomed.addChild(txt);
			background.beginFill(grayColors[field[y][x]]);
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

	var fillPixel = function(x,y) {

		if (field[y][x] === -1) return;
		if (fieldColored[y][x] === 1) return;

		fieldColored[y][x] = 1;
		coloredPixelsCount ++;

		var endFill = function () {

			front.cacheAsBitmap = false;
	
			front.beginFill(colors[field[y][x]]);
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
		mask.beginFill(colors[field[y][x]]);
		mask.drawRect(x*rectSize,y*rectSize,rectSize,rectSize);
		mask.x = mask.y = 0;
		mask.endFill();

		viewport.addChild(mask);

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

}


initGame();