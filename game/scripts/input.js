const input = require('../../framework/input');
const { upgradeTower, sellTower, quitGame, addTowerToSystem } = require('./utils');
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
    
    myMouse.registerCommand('mousedown', addTowerToSystem);
    myMouse.registerCommand('mouseup', function () {
    });
    
    myMouse.registerCommand('mousemove', function (e) {
    });
}

module.exports = {
    myMouse,
    myKeyboard,
    initInputs
}