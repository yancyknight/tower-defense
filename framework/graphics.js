init();

// Place a 'clear' function on the Canvas prototype, this makes it a part
// of the canvas, rather than making a function that calls and does it.
CanvasRenderingContext2D.prototype.clear = function () {
	this.save();
	this.setTransform(1, 0, 0, 1, 0, 0);
	this.clearRect(0, 0, canvas.width, canvas.height);
	this.restore();
};

function init() {
	canvas = document.getElementById('fw-canvas');
	context = canvas.getContext('2d');
}

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
	horizontalFlip = false
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
		context.rotate(rotation); // TODO check with yancy
		context.translate(-center.x, -center.y);
		if (horizontalFlip) {
			context.scale(-1, 1);
			dx = -dx - dWidth;
		}

		context.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
	
		context.setTransform(1, 0, 0, 1, 0, 0);
		context.restore();
	})
}

function drawLine({
	leftx,
	rightx,
	topy,
	bottomy,
	color="#000000"
} = {}) {
	context.save();
	
	context.strokeStyle = color;
	context.beginPath();
	context.moveTo(leftx, topy);
	context.lineTo(rightx, bottomy);
	context.stroke();
	
	context.restore();
}

function SpriteSheet({
	sprite = 0,
	elapsedTime = 0,
	center: {
		x = 0,
		y = 0
	} = {},
	rotation = 0,
	width,
	height,
	spriteCount,
	src,
	spriteTime = 1000,
	reverseOnFinish = false,
	horizontalFlip = false
} = {}) {
	var that = {};
	var image = Img(src);

	if(typeof spriteTime === 'number') {
		var temp = [];
		for(let i = 0; i < spriteCount; i++) {
			temp[i] = spriteTime;
		}
		spriteTime = temp;
	}

	that.updatePosition = function(pos) {
		x = pos.x;
		y = pos.y;
	}

	that.draw = function() {
		drawImage({
			image,
			sx: width * sprite,
			sy: 0,
			sWidth: width,
			sHeight: height,
			dx: x,
			dy: y,
			dWidth: width,
			dHeight: height,
			horizontalFlip: true
		})
	};

	//------------------------------------------------------------------
	//
	// Update the animation of the sprite based upon elapsed time.
	//
	//------------------------------------------------------------------
	var forward = true;
	that.update = function(elapsedTimeIn) {
		elapsedTime += elapsedTimeIn;
		// Check to see if we should update the animation frame
		if (elapsedTime >= spriteTime[sprite]) {
			// When switching sprites, keep the leftover time because
			// it needs to be accounted for the next sprite animation frame.
			elapsedTime -= spriteTime[sprite];
			// Depending upon the direction of the animation...
			if (forward === true) {
				if (reverseOnFinish && sprite == spriteCount - 1) {
					forward = false;
					sprite -= 1;
				} else {
					sprite += 1;
					// This provides wrap around from the last back to the first sprite
					sprite = sprite % spriteCount;
				}
			} else {
				if (reverseOnFinish && sprite == 0) {
					sprite += 1;
					forward = true;
				} else {
					sprite -= 1;
					// This provides wrap around from the first to the last sprite
					if (sprite < 0) {
						sprite = spriteCount - 1;
					}
				}
			}
		}
	};

	return that;
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
	drawLine,
	init,
	SpriteSheet
};

