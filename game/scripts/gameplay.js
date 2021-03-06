const graphics = require('../../framework/graphics');
const { map } = require('./map');
const { creepSystem } = require('./creeps');
const { TowerSystem } = require('./towers');
const { initialize: initializeTowers } = TowerSystem;
const { bulletSystem } = require('./bullets');
const { myMouse, myKeyboard, initInputs } = require('./input');
const { quitGame } = require('./utils');
const collision = require('../../framework/collision');
const { initialize: initializeCollision } = require('./collision');;
const pointsSystem = require('./points').floatingPointSystem;

var mouseCapture = false;
var myTexture = null;
var cancelNextRequest = false;
var lastTimeStamp;
var towerSystem = TowerSystem;
var paused = false;

function initialize() {
	console.log('game initializing...');

	initInputs();
	initializeTowers();
	creepSystem.initialize();
	bulletSystem.initialize();
	map.initialize();
	initializeCollision();

	cancelNextRequest = false;
}

function update(elapsedTime) {
	myKeyboard.update(elapsedTime);
	myMouse.update(elapsedTime);
	map.update();
	towerSystem.update(elapsedTime);
	creepSystem.update(elapsedTime);
	bulletSystem.update(elapsedTime);
	collision.update(elapsedTime);
	pointsSystem.update(elapsedTime);
	// sprite.updatePosition({x,y})
	// sprite.update(elapsedTime);
}

function render() {
	graphics.clear();
	towerSystem.render();
	creepSystem.render(); // Needs to render after tower system
	bulletSystem.render();
	// collision.drawBoundingBox();
	pointsSystem.render();
	if(vm.selectedTower) {
		graphics.drawCircle({
			x: vm.selectedTower.pos.x + 50,
			y: vm.selectedTower.pos.y + 50,
			radius: 60,
			fill: 'rgba(0,255,0,.5)',
			stroke: '#000'
		});
		graphics.drawCircle({
			x: vm.selectedTower.pos.x + 50,
			y: vm.selectedTower.pos.y + 50,
			radius: vm.selectedTower.stats.range,
			fill: 'rgba(128, 223, 255, .1)',
		});
	}
}

function gameLoop(time) {

	if(!paused) {
		update(time - lastTimeStamp);
		// console.log(time - lastTimeStamp);
		lastTimeStamp = time;
	
		render();
	}

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

function pause() {
	paused = true;
}

function unpause() {
	paused = false;
}

module.exports = {
	initialize,
	run,
	pause,
	unpause
};
