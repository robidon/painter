// (C) Ken Fyrstenberg, Epistemex, License: CC3.0-attr
var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    img = new Image(),
    play = false,
    hiddenCtx = document.createElement('canvas').getContext('2d');

// turn off image smoothing - this will give the pixelated effect
ctx.mozImageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

var canvasW = canvas.width;
var canvasH = canvas.height;
var blocksSize = 5;
console.log(canvas.width);

hiddenCtx.canvas.width=canvasW;
hiddenCtx.canvas.height=canvasH;

hiddenCtx.mozImageSmoothingEnabled = false;
hiddenCtx.webkitImageSmoothingEnabled = false;
hiddenCtx.imageSmoothingEnabled = false;

// wait until image is actually available
img.onload = pixelate;


// Start listening to resize events and draw canvas.
initialize();

function initialize() {
   // Register an event listener to call the resizeCanvas() function 
   // each time the window is resized.
   window.addEventListener('resize', resizeCanvas, false);
   // Draw canvas border for the first time.
   resizeCanvas();
}

// Display custom canvas. In this case it's a blue, 5 pixel 
// border that resizes along with the browser window.
function redraw() {
   hiddenCtx.strokeStyle = 'blue';
   hiddenCtx.lineWidth = '5';
   hiddenCtx.strokeRect(0, 0, window.innerWidth, window.innerHeight);
}

// Runs each time the DOM window resize event fires.
// Resets the canvas dimensions to match window,
// then draws the new borders accordingly.
function resizeCanvas() {
    htmlCanvas.width = window.innerWidth;
    htmlCanvas.height = window.innerHeight;
    redraw();
}

// some image, we are not struck with CORS restrictions as we
// do not use pixel buffer to pixelate, so any image will do
img.src = 'i/man.jpg';
// MAIN function
function pixelate(v) {

    // if in play mode use that value, else use slider value
    var scaleDimention = Math.min(canvasW, canvasH);
    var size = (play ? v : blocksSize) * 0.01,

        // cache scaled width and height
        w = scaleDimention * size,
        h = scaleDimention * size;

    // draw original image to the scaled size
    ctx.drawImage(img, 0, 0, w, h);

    // then draw that scaled image thumb back to fill canvas
    // As smoothing is off the result will be pixelated
    ctx.drawImage(canvas, 0, 0, w, h, 0, 0, scaleDimention, scaleDimention);

    //for(var x=0;x<size)
}

// This runs the demo animation to give an impression of
// performance.
function toggleAnim() {

    // limit blocksize as we don't want to animate tiny blocks
    var v = Math.min(25, parseInt(blocksSize, 10)),
        dx = 0.1; /// "speed"

    // toggle play flag set by button "Animate"
    play = !play;

    // and update button's text
    animate.value = play ? 'Stop' : 'Animate';

    // if in play mode start loop
    if (play === true) anim();

    // animation loop
    function anim() {

        // increase or decrease value
        v += dx;

        // if at min or max reverse delta
        if (v <= 1 || v > 25) dx = -dx;

        // pixelate image with current value
        pixelate(v);

        // loop
        if (play) requestAnimationFrame(anim);
    }
}

canvas.addEventListener('click', function (e) {
    console.log(e.offsetX, e.offsetY);
    var c = ctx.getImageData(e.offsetX, e.offsetY, 1, 1).data;

}, false);

// poly-fill for requestAnmationFrame with fallback for older
// browsers which do not support rAF.
window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();