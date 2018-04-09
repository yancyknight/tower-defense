
function initialize() {
	const showScreen = require('./showScreen');
	const gamePlay = require('./gameplay');
	const highScores = require('./highscores');
	const help = require('./help');
	const about = require('./about');
	// Setup each of menu events for the screens
	document.getElementById('id-new-game').addEventListener(
		'click',
		function() {showScreen(gamePlay); });
	
	document.getElementById('id-high-scores').addEventListener(
		'click',
		function() { showScreen(highScores); });
	
	document.getElementById('id-help').addEventListener(
		'click',
		function() { showScreen(help); });
	
	document.getElementById('id-about').addEventListener(
		'click',
		function() { showScreen(about); });
}

function run() {
	// I know this is empty, there isn't anything to do.
}

module.exports = {
	initialize: initialize,
	run: run,
	id: 'main-menu'
};
