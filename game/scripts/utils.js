function upgradeTower() {
    console.log(`upgrade tower now!`);
}

function sellTower() {
    console.log(`sell tower now!`);
}

function startLevel() {
    console.log(`start level now!`);
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
    quitGame
}