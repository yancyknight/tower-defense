const graphics = require('../../framework/graphics');
const object = require('../../framework/object');
const mapModule = require('./map');
const creepModule = require('./creeps');
<<<<<<< HEAD
const towerModule = require('./towers');
const bulletModule = require('./bullets');
=======
const { myMouse, myKeyboard, initInputs } = require('./input');
>>>>>>> origin/master

var mouseCapture = false;
var myTexture = null;
var cancelNextRequest = false;
var lastTimeStamp;
var map = mapModule.map;
var creepSystem = creepModule.creepSystem
var towerSystem = towerModule.towerSystem(map);
var bulletSystem = bulletModule.bulletSystem;
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
		type: creepModule.CreepType.EYEBALL,
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
		type: creepModule.CreepType.FIREWOOF,
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
<<<<<<< HEAD

	creepSystem.addCreepSystem({
		time: 30000,
		amount: 70,
		type: creepModule.CreepType.JETSTER,
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
		type: towerModule.TowerType.TOWER11,
		pos: {x:9, y:9},
		});

	towerSystem.addTower({
		type: towerModule.TowerType.TOWER12,
		pos: {x:11, y:11},
		});
	towerSystem.addTower({
		type: towerModule.TowerType.TOWER13,
		pos: {x:11, y:9},
		});
	
	towerSystem.addTower({
		type: towerModule.TowerType.TOWER21,
		pos: {x:9, y:11},
		});	
	towerSystem.addTower({
		type: towerModule.TowerType.TOWER22,
		pos: {x:7, y:11},
		});	
		towerSystem.addTower({
			type: towerModule.TowerType.TOWER23,
			pos: {x:7, y:7},
			});
		towerSystem.addTower({
			type: towerModule.TowerType.TOWER31,
			pos: {x:7, y:9},
			});
		
		towerSystem.addTower({
			type: towerModule.TowerType.TOWER32,
			pos: {x:9, y:7},
			});	
		towerSystem.addTower({
			type: towerModule.TowerType.TOWER33,
			pos: {x:11, y:7},
			});	

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
=======
>>>>>>> origin/master
}

var x = 10;
var y = 500;
function update(elapsedTime) {
	myKeyboard.update(elapsedTime);
	myMouse.update(elapsedTime);
	map.update();
	towerSystem.update(elapsedTime);
	creepSystem.update(elapsedTime);
	bulletSystem.update(elapsedTime);
	x += 1;
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
