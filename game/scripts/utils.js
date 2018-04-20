const towers = require('./towers');
const { map } = require('./map');

function upgradeTower() {
    console.log(`upgrade tower now!`);
}

function sellTower() {
    console.log(`sell tower now!`);
}

function startLevel() {
    console.log(`start level now!`);
}

function addTowerToSystem() {
	if(vm.placeTower === '')return;
	if(vm.money < 100) return; // tower cost
	var position = { x: Math.floor(vm.mousePosition.x / 50),
		y: Math.floor(vm.mousePosition.y / 50)};
	if(!map.validPosition(position)) return;
	towers.TowerSystem.addTower({
        type: towers.TowerType[vm.placeTower],
        pos: position
    });
    vm.placeTower = '';
}

function quitGame() {
	// Stop the game loop by canceling the request for the next animation frame
	cancelNextRequest = true;

	vm.$confirm('Quit game and return to main menu?', 'Quit Game', {
		confirmButtonText: 'Get me outta here!',
		cancelButtonText: `No! I'm winning!`
	}).then(function() {
        const { myKeyboard } = require('./input');
        myKeyboard.deregisterAll();
		vm.show = 'main-menu';
	}).catch(function() {
		cancelNextRequest = false;    
		run();    
	});
}

module.exports = {
    upgradeTower,
    sellTower,
    startLevel,
	quitGame,
	addTowerToSystem
}