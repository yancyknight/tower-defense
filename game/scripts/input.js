const input = require('../../framework/input');
const { upgradeTower, sellTower, quitGame, addTowerToSystem, selectTower } = require('./utils');
const { nextLevel } = require('./level');

var myMouse = input.Mouse();
var myKeyboard = input.Keyboard();

function initInputs() {
    // Create the keyboard input handler and register the keyboard commands
    myMouse.init();
    myKeyboard.init();
    myKeyboard.registerCommand(input.KeyEvent.DOM_VK_ESCAPE, quitGame, true);
    myKeyboard.registerCommand(input.KeyEvent.DOM_VK_U, upgradeTower, true);
    myKeyboard.registerCommand(input.KeyEvent.DOM_VK_S, sellTower, true);
    myKeyboard.registerCommand(input.KeyEvent.DOM_VK_G, nextLevel, true);
    
    // Reverse the order of these two lines if we want to auto select a tower after placing it.
    myMouse.registerCommand('mousedown', selectTower);
    myMouse.registerCommand('mousedown', addTowerToSystem);
    // myMouse.registerCommand('mouseup', function () {
    // });
    
    // myMouse.registerCommand('mousemove', function (e) {
    // });
}

module.exports = {
    myMouse,
    myKeyboard,
    initInputs
}