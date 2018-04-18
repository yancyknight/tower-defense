const graphics = require('../../framework/graphics');
const object = require('../../framework/object');
const mapModule = require('./map');
const creepModule = require('./creeps');
const { myMouse, myKeyboard, initInputs } = require('./input');

var mouseCapture = false;
var myTexture = null;
var cancelNextRequest = false;
var lastTimeStamp;
var map = mapModule.map;
var creepSystem = creepModule.creepSystem();
var sprite = object.AnimatedModel({
	center: {
		x: 500,
		y: 500
	},
	width: 32,
	height: 32,
	spriteCount: 3,
	src: '/eyebawl.png',
	spriteTime: 500,
	reverseOnFinish: true,
	horizontalFlip: true
});

function initialize() {
	console.log('game initializing...');
	initInputs();

	cancelNextRequest = false;
	creepSystem.addCreepSystem({
		time: 10000,
		amount: 50,
		type: creepModule.CreepType.ALIEN,
		startingPositions: [{
			x: 0,
			y: 8
		}, {
			x: 0,
			y: 9
		}, {
			x: 0,
			y: 10
		}, {
			x: 0,
			y: 11
		}],
		endingPositions: [{x: 19,y: 8},
						  {x: 19,y: 9},
						  {x: 19,y: 10},
						  {x: 19,y: 11}]
	});

	creepSystem.addCreepSystem({
		time: 20000,
		amount: 50,
		type: creepModule.CreepType.ALIEN,
		startingPositions: [{
			x: 8,
			y: 0
		}, {
			x: 9,
			y: 0
		}, {
			x: 10,
			y: 0
		}, {
			x: 11,
			y: 0
		}],
		endingPositions: [{x: 8,y: 19},
						  {x: 9,y: 19},
						  {x: 10,y: 19},
						  {x: 11,y: 19}]
	});
}

var x = 10;
var y = 500;
function update(elapsedTime) {
	myKeyboard.update(elapsedTime);
	myMouse.update(elapsedTime);
	map.update();
	creepSystem.update(elapsedTime);
	x += 1;
	sprite.updatePosition({x,y})
	sprite.update(elapsedTime);
}

function render() {
	graphics.clear();
	sprite.render();
	// map.render();
	// creepSystem.render();
}

function gameLoop(time) {

	update(time - lastTimeStamp);
	// console.log(time - lastTimeStamp);
	lastTimeStamp = time;

	render();

	if (!cancelNextRequest) {
		requestAnimationFrame(gameLoop);
	}
}

function run() {
	lastTimeStamp = performance.now();

	// Start the animation loop
	cancelNextRequest = false;
	requestAnimationFrame(gameLoop);
}

module.exports = {
	initialize: initialize,
	run: run
};
