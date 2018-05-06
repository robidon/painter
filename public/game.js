var piApp;
var game = {
	data: {
		container:"#canvas",
		width:100,
		height:100,
		colorsCount:10,
		cellSize:10,
		map: []
	},
	methods: {
		init:function () {
			this.buildRandomMap();
			let type = "WebGL"
			if(!PIXI.utils.isWebGLSupported()){
			  type = "canvas"
			}

			PIXI.utils.sayHello(type)

			//Create a Pixi Application
			let app = piApp = new PIXI.Application({ 
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

			app.stage.transform.
			//Add the canvas that Pixi automatically created for you to the HTML document
			document.body.appendChild(app.view);


		},
		buildRandomMap:function () {
			for (var y=0;y<game.data.height;y++) {
				game.data.map.push([]);
				for (var x=0;x<game.data.width;x++) {
					game.data.map[y].push(Math.round(Math.random()*game.data.colorsCount));
				}
			}
			console.log(game.data.map)
		},
		start:function () {

		}
	}
}