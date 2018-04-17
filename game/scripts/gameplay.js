const graphics = require('../../framework/graphics');
const input = require('../../framework/input');
const showScreen = require('./showScreen');
const mainMenu = require('./mainmenu');
const mapModule = require('./map');
const creepModule = require('./creeps');

var mouseCapture = false,
	myMouse = input.Mouse(),
	myKeyboard = input.Keyboard(),
	myTexture = null,
	cancelNextRequest = false,
	lastTimeStamp,
	map = mapModule.map,
	creepSystem = creepModule.creepSystem();

function initialize() {
	console.log('game initializing...');

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

	// Create the keyboard input handler and register the keyboard commands
	// myKeyboard.registerCommand(KeyEvent.DOM_VK_A, myTexture.moveLeft);
	// myKeyboard.registerCommand(KeyEvent.DOM_VK_D, myTexture.moveRight);
	// myKeyboard.registerCommand(KeyEvent.DOM_VK_W, myTexture.moveUp);
	// myKeyboard.registerCommand(KeyEvent.DOM_VK_S, myTexture.moveDown);
	// myKeyboard.registerCommand(KeyEvent.DOM_VK_Q, myTexture.rotateLeft);
	// myKeyboard.registerCommand(KeyEvent.DOM_VK_E, myTexture.rotateRight);
	myKeyboard.registerCommand(input.KeyEvent.DOM_VK_ESCAPE, function () {

		// Stop the game loop by canceling the request for the next animation frame
		cancelNextRequest = true;

		// Then, return to the main menu
		showScreen(mainMenu);
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

//------------------------------------------------------------------
//
// This is the Game Loop function!
//
//------------------------------------------------------------------
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
	run: run,
	id: 'game-play'
};
