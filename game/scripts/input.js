const input = require('../../framework/input');
const { upgradeTower, sellTower, startLevel, quitGame } = require('./utils');

var myMouse = input.Mouse();
var myKeyboard = input.Keyboard();

// Create the keyboard input handler and register the keyboard commands
myKeyboard.registerCommand(input.KeyEvent.DOM_VK_ESCAPE, quitGame);
myKeyboard.registerCommand(input.KeyEvent.DOM_VK_U, upgradeTower, true);
myKeyboard.registerCommand(input.KeyEvent.DOM_VK_S, sellTower, true);
myKeyboard.registerCommand(input.KeyEvent.DOM_VK_G, startLevel, true);

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

module.exports = {
    myMouse,
    myKeyboard
}