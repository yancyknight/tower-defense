module.exports = function showScreen(screen) {
	let screenIndex = 0;
	let active = null;

	active = document.getElementsByClassName('active');
	for (screenIndex = 0; screenIndex < active.length; screenIndex++) {
		active[screenIndex].classList.remove('active');
	}

	// Tell the screen to start actively running
	screen.run();

	// Then, set the new screen to be active
	document.getElementById(screen.id).classList.add('active');
}