const graphics = require('../../framework/graphics');
const input = require('../../framework/input');
const mapModule = require('./map');

var mouseCapture = false;
var myMouse = input.Mouse();
var myKeyboard = input.Keyboard();
var myTexture = null;
var cancelNextRequest = false;
var lastTimeStamp;
var map;

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
	map = mapModule.createMap({imageSrc: 'https://cnet1.cbsistatic.com/img/_hQqXhr3_GT2VJK36JhNq-QAcMQ=/1600x900/2016/11/22/92ef90df-13ae-4cdc-949e-035eac407727/brgavinshaw.jpg'});

	console.log(`map`, map);
	// Create the keyboard input handler and register the keyboard commands
	myKeyboard.registerCommand(input.KeyEvent.DOM_VK_ESCAPE, quitGame);
	
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
	map.update();
}

function render() {
	graphics.clear();
	map.render();
}

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
	run: run
};
