const graphics = require('../../framework/graphics');
const input = require('../../framework/input');
const mapModule = require('./map');
const creepModule = require('./creeps');

var mouseCapture = false;
var myMouse = input.Mouse();
var myKeyboard = input.Keyboard();
var myTexture = null;
var cancelNextRequest = false;
var lastTimeStamp;
var map = mapModule.map;
var creepSystem = creepModule.creepSystem();

function quitGame() {
	// Stop the game loop by canceling the request for the next animation frame
	cancelNextRequest = true;

	view.$confirm('Quit game and return to main menu?', 'Quit Game', {
		confirmButtonText: 'Yes',
		cancelButtonText: `No! I'm winning!`
	}).then(function() {
		view.show = 'main-menu';
	}).catch(function() {
		cancelNextRequest = false;    
		run();    
	});
}

function initialize() {
	console.log('game initializing...');

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

	// console.log(`map`, map);
	// Create the keyboard input handler and register the keyboard commands
	myKeyboard.registerCommand(input.KeyEvent.DOM_VK_ESCAPE, quitGame);
	
	myKeyboard.registerCommand(input.KeyEvent.DOM_VK_ESCAPE, function () {

		// Stop the game loop by canceling the request for the next animation frame
		cancelNextRequest = true;

	});

	// Create an ability to move the logo using the mouse
	myMouse = input.Mouse();
	myMouse.registerCommand('mousedown', function (e) {
		mouseCapture = true;
		// myTexture.moveTo({x: e.clientX, y: e.clientY});
	});

	myMouse.registerCommand('mouseup', function () {
		mouseCapture = false;
	});

	myMouse.registerCommand('mousemove', function (e) {
		if (mouseCapture) {
			// myTexture.moveTo({x: e.clientX, y: e.clientY});
		}
	});
}

function update(elapsedTime) {
	myKeyboard.update(elapsedTime);
	myMouse.update(elapsedTime);
	map.update();
	creepSystem.update(elapsedTime);
}

function render() {
	graphics.clear();
	map.render();
	creepSystem.render();
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
