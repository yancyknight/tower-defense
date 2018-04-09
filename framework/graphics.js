'use strict';
var canvas = document.getElementById('fw-canvas');
var context = canvas.getContext('2d');

// Place a 'clear' function on the Canvas prototype, this makes it a part
// of the canvas, rather than making a function that calls and does it.
CanvasRenderingContext2D.prototype.clear = function () {
	this.save();
	this.setTransform(1, 0, 0, 1, 0, 0);
	this.clearRect(0, 0, canvas.width, canvas.height);
	this.restore();
};

function clear() {
	context.clear();
}


function drawCircle({
	x,
	y,
	radius,
	fill = '#000000',
	stroke = '#000000',
} = {}) {
	context.save();
	context.beginPath();

	context.fillStyle = fill;
	context.strokeStyle = stroke;
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();

	context.stroke();
	context.restore();
};

function drawRectangle({
	x = 0,
	y = 0,
	w = 100,
	h = 100,
	fill = '#000000',
	stroke = '#000000',
} = {}) {
	context.save();
	context.beginPath();

	context.strokeStyle = stroke;
	context.fillStyle = fill;
	context.strokeRect(x, y, w, h);
	context.fillRect(x, y, w, h);

	context.closePath();
	context.restore();
}

function drawText({
	text,
	x = 0,
	y = 0,
	fill = '#000000',
	font = '48px serif',
} = {}) {
	context.save();

	context.fillStyle = fill;
	context.font = font;
	context.fillText(text, x, y);

	context.restore();
}

function Img(src) {
	return new Promise(function(resolve, reject) {
		var img = new Image();
		img.src = src;
		img.onload = function() {
			resolve(img);
		}
	});
}

function drawImage({
	image,
	dx,
	dy,
	sx = 0,
	sy = 0,
	sWidth,
	sHeight,
	dWidth,
	dHeight,
	rotation = 0,
} = {}) {
	var self = this;
	image.then(function(img){
		if (typeof sWidth === 'undefined') sWidth = img.naturalWidth;
		if (typeof dWidth === 'undefined') dWidth = img.naturalWidth;
		if (typeof sHeight === 'undefined') sHeight = img.naturalHeight;
		if (typeof dHeight === 'undefined') dHeight = img.naturalHeight;

		var center = {
			x: dx + (dWidth * .5),
			y: dy + (dHeight * .5),
		}

		context.save();
		context.translate(center.x, center.y);
		context.rotate(rotation * (Math.PI / 180));
		context.translate(-center.x, -center.y);


		context.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
	
		context.restore();
	})
}

module.exports = {
	clear,
	canvas,
	context,
	drawRectangle,
	Img,
	drawImage,
	drawText,
	drawCircle,
};

