import Vue from "vue";
import RgbQuant from "rgbquant";

new Vue({
  el: '#app',
  created: function () {
		var img = new Image();
		img.src = 'i/man.jpg';
		img.onload = function() {
		  draw(this);
		};
		function draw(img) {
		  	var canvas = document.getElementById('canvas');
		  	var ctx = canvas.getContext('2d');
			canvas.height = 50;
			canvas.width = Math.min(50, canvas.height/img.height*img.width);
			var size = 1,
			    w = canvas.width / size,
			    h = canvas.height / size;

			// draw the original image at a fraction of the final size
			ctx.drawImage(img, 0, 0, w, h);

			// turn off image aliasing
			ctx.msImageSmoothingEnabled = false;
			ctx.mozImageSmoothingEnabled = false;
			ctx.webkitImageSmoothingEnabled = false;
			ctx.imageSmoothingEnabled = false;

			// enlarge the minimized image to full size    
			ctx.drawImage(canvas, 0, 0, w, h, 0, 0, canvas.width, canvas.height);
			
			var myImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
			
			// reduce palette
			for(var y = 0;y<myImageData.height;y++) {
				for (var x = 0;x<myImageData.width;x++) {

				}
			}
			// options with defaults (not required)
			var opts = {
			    colors: 3,             	 // desired palette size
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
			q.sample(myImageData);

			// build palette
			var pal = q.palette();

			// reduce images
			var out = q.reduce(myImageData);
			//console.log(img);
			//console.log(out);
			var imgData=ctx.createImageData(myImageData.width,myImageData.height);
			for (var i=0;i<imgData.data.length;i+=4)
			{
			  imgData.data[i+0]=out[i+0];
			  imgData.data[i+1]=out[i+1];
			  imgData.data[i+2]=out[i+2];
			  imgData.data[i+3]=out[i+3];
			}
			ctx.putImageData(imgData,0,0);
 

			//ctx.drawImage(out, 0, 0, w, h, 0, 0, canvas.width, canvas.height);


			var data = Array.prototype.slice.call(out);
			var version = 1;
			data.unshift(version, myImageData.width, myImageData.height);
			var str = JSON.stringify(data);
			console.log(str);
		}
	}
})