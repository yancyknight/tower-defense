
function initialize() {
	const showScreen = require('./showScreen');
	const mainMenu = require('./mainmenu');
	document.getElementById('id-about-back').addEventListener(
		'click',
		function() { showScreen(mainMenu); });
}

function run() {
	//
	// I know this is empty, there isn't anything to do.
}

module.exports = {
	initialize: initialize,
	run: run,
	id: 'about'
};
