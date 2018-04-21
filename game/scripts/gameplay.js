const graphics = require('../../framework/graphics');
const object = require('../../framework/object');
const { map } = require('./map');
const { creepSystem } = require('./creeps');
const { TowerSystem, TowerType } = require('./towers');
const { initialize: initializeTowers } = TowerSystem;
const { bulletSystem } = require('./bullets');
const { myMouse, myKeyboard, initInputs } = require('./input');
const input = require('../../framework/input');
const audio = require('./audio');
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
<<<<<<< HEAD

	towerSystem.addTower({
		type: TowerType.TOWER21,
		pos: {x:9, y:9},
	});/*

	towerSystem.addTower({
		type: TowerType.TOWER12,
		pos: {x:11, y:11},
	});
	towerSystem.addTower({
		type: TowerType.TOWER13,
		pos: {x:11, y:9},
	});
	
	towerSystem.addTower({
		type: TowerType.TOWER21,
		pos: {x:9, y:11},
	});	
	towerSystem.addTower({
		type: TowerType.TOWER22,
		pos: {x:7, y:11},
	});	
	towerSystem.addTower({
		type: TowerType.TOWER23,
		pos: {x:7, y:7},
	});
	towerSystem.addTower({
		type: TowerType.TOWER31,
		pos: {x:7, y:9},
	});
	
	towerSystem.addTower({
		type: TowerType.TOWER32,
		pos: {x:9, y:7},
	});	
	towerSystem.addTower({
		type: TowerType.TOWER33,
		pos: {x:11, y:7},
	});*/
=======
>>>>>>> origin/master
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
	collision.drawBoundingBox();
	pointsSystem.render();
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
