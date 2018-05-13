import Vue from "vue";
import Tinycolor from "tinycolor2"; 
import RgbQuant from "rgbquant";

new Vue({
  el: '#app',
  data:{
  	palette:[]
  },
  created: function () {
		var T = this;
		var img = new Image();
		img.src = 'i/Pile-of-Skulls-PNG-Clipart.png';
		img.onload = function() {
		  draw(this);
		};
		function draw(img) {
		  	var sourceCanvas = document.getElementById('sourceCanvas');
		  	var pixelatedCanvas = document.getElementById('pixelatedCanvas');
		  	var resultCanvas = document.getElementById('resultCanvas');


			// draw original large scale image
		  	var sourceContext = sourceCanvas.getContext('2d');
		  	sourceCanvas.width = pixelatedCanvas.width = 150;
		  	sourceCanvas.height = pixelatedCanvas.height = img.height * sourceCanvas.width / img.width;
		  	sourceContext.drawImage(img,0,0,sourceCanvas.width,sourceCanvas.height);


			//draw result canvas
		  	var resultContext = resultCanvas.getContext('2d');
			var size = 1,
			    w = Math.floor(pixelatedCanvas.width / size),
			    h = Math.floor(pixelatedCanvas.height / size);
			resultCanvas.width = w;
			resultCanvas.height = h;
			resultContext.drawImage(img, 0, 0, w, h);
			var sourceImageData = resultContext.getImageData(0, 0, w, h);
			var opts = {
			    colors: 10,              // desired palette size
			    method: 2,               // histogram method, 2: min-population threshold within subregions; 1: global top-population
			    boxSize: [64,64],        // subregion dims (if method = 2)
			    boxPxls: 2,              // min-population threshold (if method = 2)
			    initColors: 4096,        // # of top-occurring colors  to start with (if method = 1)
			    minHueCols: 0,           // # of colors per hue group to evaluate regardless of counts, to retain low-count hues
			    dithKern: null,          // dithering kernel name, see available kernels in docs below
			    dithDelta: 0,            // dithering threshhold (0-1) e.g: 0.05 will not dither colors with <= 5% difference
			    dithSerp: false,         // enable serpentine pattern dithering
			    palette: [],             // a predefined palette to start with in r,g,b tuple format: [[r,g,b],[r,g,b]...]
			    reIndex: false,          // affects predefined palettes only. if true, allows compacting of sparsed palette once target palette size is reached. also enables palette sorting.
			    useCache: true,          // enables caching for perf usually, but can reduce perf in some cases, like pre-def palettes
			    cacheFreq: 10,           // min color occurance count needed to qualify for caching
			    colorDist: "euclidean",  // method used to determine color distance, can also be "manhattan"
			};
			var q = new RgbQuant(opts);

			// analyze histograms
			q.sample(sourceImageData);

			// build palette
			var pal = q.palette();

			// reduce images
			var out = q.reduce(sourceImageData);
			for (var i=0;i<sourceImageData.data.length;i+=4)
			{
			  sourceImageData.data[i+0]=out[i+0];
			  sourceImageData.data[i+1]=out[i+1];
			  sourceImageData.data[i+2]=out[i+2];
			  sourceImageData.data[i+3]=out[i+3];
			}
			resultContext.putImageData(sourceImageData,0,0);

			// draw large scale pixelated image
		  	var pixelatedContext = pixelatedCanvas.getContext('2d');
			pixelatedContext.msImageSmoothingEnabled = false;
			pixelatedContext.mozImageSmoothingEnabled = false;
			pixelatedContext.webkitImageSmoothingEnabled = false;
			pixelatedContext.imageSmoothingEnabled = false;
			pixelatedContext.drawImage(resultCanvas, 0, 0, w, h, 0, 0, pixelatedCanvas.width, pixelatedCanvas.height);

			// render palette
			var newpalette = [];
			for (var i=0;i<pal.length;i+=4) {
				let color = Tinycolor({r:pal[i],g:pal[i+1],b:pal[i+2],a:pal[i+3]/255});
				newpalette.push(color.toHex8String());
			}
			T.palette = newpalette;

			var resultImageObject = {
				w:w,
				h:h,
				palette:newpalette,
				data:[]
			}
			for(var i=0;i<sourceImageData.data.length;i+=4) {
				let found = false;
				if ((sourceImageData.data[i]===0) && (sourceImageData.data[i+1]===0) && (sourceImageData.data[i+2]===0) && (sourceImageData.data[i+3]===0)) {
					resultImageObject.data.push(0);
					continue;
				}
				for (var c=0;c<pal.length;c+=4) {
					if (
						(sourceImageData.data[i] === pal[c]) &&
						(sourceImageData.data[i+1] === pal[c+1]) &&
						(sourceImageData.data[i+2] === pal[c+2]) &&
						(sourceImageData.data[i+3] === pal[c+3])
					) {
						resultImageObject.data.push(Math.floor(c/4)+1);
						found = true;
						break;
					}
				}
				if (!found) {
					console.log('what?');
					console.log([sourceImageData.data[i],sourceImageData.data[i+1],sourceImageData.data[i+2],sourceImageData.data[i+3]]);
					break;
				}
			}
			console.log(resultImageObject);
			//console.log(sourceImageData);
			console.log(JSON.stringify(resultImageObject));

		}
	}
})