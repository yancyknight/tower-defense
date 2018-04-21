const towers = require('./towers');
const { map } = require('./map');
const { nextLevel } = require('./level');

function upgradeTower() {
    console.log(`upgrade tower now!`);
}

function sellTower() {
    console.log(`sell tower now!`);
}

function addTowerToSystem() {
	if(vm.placeTower === '')return;
	if(!vm.mousePosition) return;
	if(vm.money < towers.towerCosts[vm.placeTower]) return; // tower cost
	var position = { x: Math.floor(vm.mousePosition.x / 50),
		y: Math.floor(vm.mousePosition.y / 50)};
	if(!map.validPosition(position)) return;
	towers.TowerSystem.addTower({
        type: towers.TowerType[vm.placeTower],
        pos: position
    });
	vm.money -= towers.towerCosts[vm.placeTower];
	vm.placeTower = '';
}

function quitGame() {
	vm.$confirm('Quit game and return to main menu?', 'Quit Game', {
		confirmButtonText: 'Get me outta here!',
		cancelButtonText: `No! I'm winning!`
	}).then(function() {
        const { myKeyboard } = require('./input');
        myKeyboard.deregisterAll();
		vm.show = 'main-menu';
	}).catch(function() {
		cancelNextRequest = false;    
	});
}

module.exports = {
    upgradeTower,
    sellTower,
	quitGame,
	addTowerToSystem
}