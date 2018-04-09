const graphics = require('../../framework/graphics');
const input = require('../../framework/input');
const showScreen = require('./showScreen');
const mainMenu = require('./mainmenu');

var mouseCapture = false,
	myMouse = input.Mouse(),
	myKeyboard = input.Keyboard(),
	myTexture = null,
	cancelNextRequest = false,
	lastTimeStamp;

function initialize() {
	console.log('game initializing...');

	// Create the keyboard input handler and register the keyboard commands
	// myKeyboard.registerCommand(KeyEvent.DOM_VK_A, myTexture.moveLeft);
	// myKeyboard.registerCommand(KeyEvent.DOM_VK_D, myTexture.moveRight);
	// myKeyboard.registerCommand(KeyEvent.DOM_VK_W, myTexture.moveUp);
	// myKeyboard.registerCommand(KeyEvent.DOM_VK_S, myTexture.moveDown);
	// myKeyboard.registerCommand(KeyEvent.DOM_VK_Q, myTexture.rotateLeft);
	// myKeyboard.registerCommand(KeyEvent.DOM_VK_E, myTexture.rotateRight);
	myKeyboard.registerCommand(input.KeyEvent.DOM_VK_ESCAPE, function() {

		// Stop the game loop by canceling the request for the next animation frame
		cancelNextRequest = true;

		// Then, return to the main menu
		showScreen(mainMenu);
	});
	
	// Create an ability to move the logo using the mouse
	myMouse = input.Mouse();
	myMouse.registerCommand('mousedown', function(e) {
		mouseCapture = true;
		// myTexture.moveTo({x: e.clientX, y: e.clientY});
	});

	myMouse.registerCommand('mouseup', function() {
		mouseCapture = false;
	});

	myMouse.registerCommand('mousemove', function(e) {
		if (mouseCapture) {
			// myTexture.moveTo({x: e.clientX, y: e.clientY});
		}
	});
}

function update(elapsedTime) {
	myKeyboard.update(elapsedTime);
	myMouse.update(elapsedTime);
}

function render() {
	graphics.clear();
	// myTexture.draw();
}

//------------------------------------------------------------------
//
// This is the Game Loop function!
//
//------------------------------------------------------------------
function gameLoop(time) {
	
	update(time - lastTimeStamp);
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
