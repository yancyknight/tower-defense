const graphics = require('../../framework/graphics');
const object = require('../../framework/object');
const { map } = require('./map');
const { creepSystem } = require('./creeps');
const { TowerSystem, TowerType } = require('./towers');
const { bulletSystem } = require('./bullets');
const { myMouse, myKeyboard, initInputs } = require('./input');
const input = require('../../framework/input');
const audio = require('./audio');
const { quitGame } = require('./utils');
const { startLevel } = require('./level');
const collision = require('../../framework/collision');

var mouseCapture = false;
var myTexture = null;
var cancelNextRequest = false;
var lastTimeStamp;
var towerSystem = TowerSystem(map);

function initialize() {
	console.log('game initializing...');
	initInputs();

	startLevel.one();

	cancelNextRequest = false;

	towerSystem.addTower({
		type: TowerType.TOWER11,
		pos: {x:9, y:9},
	});

	// towerSystem.addTower({
	// 	type: TowerType.TOWER12,
	// 	pos: {x:11, y:11},
	// });
	// towerSystem.addTower({
	// 	type: TowerType.TOWER13,
	// 	pos: {x:11, y:9},
	// });
	
	// towerSystem.addTower({
	// 	type: TowerType.TOWER21,
	// 	pos: {x:9, y:11},
	// });	
	// towerSystem.addTower({
	// 	type: TowerType.TOWER22,
	// 	pos: {x:7, y:11},
	// });	
	// towerSystem.addTower({
	// 	type: TowerType.TOWER23,
	// 	pos: {x:7, y:7},
	// });
	// towerSystem.addTower({
	// 	type: TowerType.TOWER31,
	// 	pos: {x:7, y:9},
	// });
	
	// towerSystem.addTower({
	// 	type: TowerType.TOWER32,
	// 	pos: {x:9, y:7},
	// });	
	// towerSystem.addTower({
	// 	type: TowerType.TOWER33,
	// 	pos: {x:11, y:7},
	// });
}

function update(elapsedTime) {
	myKeyboard.update(elapsedTime);
	myMouse.update(elapsedTime);
	map.update();
	towerSystem.update(elapsedTime);
	creepSystem.update(elapsedTime);
	bulletSystem.update(elapsedTime);
	collision.update(elapsedTime);
	// sprite.updatePosition({x,y})
	// sprite.update(elapsedTime);
}

function render() {
	graphics.clear();
	creepSystem.render();
	towerSystem.render();
	bulletSystem.render();
	collision.drawBoundingBox();
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
