const graphics = require('../../framework/graphics');
const object = require('../../framework/object');
const { map } = require('./map');
const { creepSystem, CreepType } = require('./creeps');
const { TowerSystem, TowerType } = require('./towers');
const { bulletSystem } = require('./bullets');
const { myMouse, myKeyboard, initInputs } = require('./input');
const input = require('../../framework/input');
const audio = require('./audio');
const { quitGame } = require('./utils');

var mouseCapture = false;
var myTexture = null;
var cancelNextRequest = false;
var lastTimeStamp;
var towerSystem = TowerSystem(map);
/*var sprite = object.AnimatedModel({
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
});*/

function initialize() {
	console.log('game initializing...');
	initInputs();

	cancelNextRequest = false;
	creepSystem.addCreepSystem({
		time: 10000,
		amount: 50,
		type: CreepType.EYEBALL,
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
		type: CreepType.FIREWOOF,
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

	creepSystem.addCreepSystem({
		time: 30000,
		amount: 70,
		type: CreepType.JETSTER,
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

	towerSystem.addTower({
		type: TowerType.TOWER11,
		pos: {x:9, y:9},
	});

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
	});
}

function update(elapsedTime) {
	myKeyboard.update(elapsedTime);
	myMouse.update(elapsedTime);
	map.update();
	towerSystem.update(elapsedTime);
	creepSystem.update(elapsedTime);
	bulletSystem.update(elapsedTime);
	// sprite.updatePosition({x,y})
	// sprite.update(elapsedTime);
}

function render() {
	graphics.clear();
	creepSystem.render();
	towerSystem.render();
	bulletSystem.render();
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
