/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./game/scripts/game.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./framework/graphics.js":
/*!*******************************!*\
  !*** ./framework/graphics.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar canvas = document.getElementById('fw-canvas');\nvar context = canvas.getContext('2d');\n\n// Place a 'clear' function on the Canvas prototype, this makes it a part\n// of the canvas, rather than making a function that calls and does it.\nCanvasRenderingContext2D.prototype.clear = function () {\n\tthis.save();\n\tthis.setTransform(1, 0, 0, 1, 0, 0);\n\tthis.clearRect(0, 0, canvas.width, canvas.height);\n\tthis.restore();\n};\n\nfunction clear() {\n\tcontext.clear();\n}\n\n\nfunction drawCircle({\n\tx,\n\ty,\n\tradius,\n\tfill = '#000000',\n\tstroke = '#000000',\n} = {}) {\n\tcontext.save();\n\tcontext.beginPath();\n\n\tcontext.fillStyle = fill;\n\tcontext.strokeStyle = stroke;\n    context.arc(x, y, radius, 0, Math.PI * 2);\n    context.fill();\n\n\tcontext.stroke();\n\tcontext.restore();\n};\n\nfunction drawRectangle({\n\tx = 0,\n\ty = 0,\n\tw = 100,\n\th = 100,\n\tfill = '#000000',\n\tstroke = '#000000',\n} = {}) {\n\tcontext.save();\n\tcontext.beginPath();\n\n\tcontext.strokeStyle = stroke;\n\tcontext.fillStyle = fill;\n\tcontext.strokeRect(x, y, w, h);\n\tcontext.fillRect(x, y, w, h);\n\n\tcontext.closePath();\n\tcontext.restore();\n}\n\nfunction drawText({\n\ttext,\n\tx = 0,\n\ty = 0,\n\tfill = '#000000',\n\tfont = '48px serif',\n} = {}) {\n\tcontext.save();\n\n\tcontext.fillStyle = fill;\n\tcontext.font = font;\n\tcontext.fillText(text, x, y);\n\n\tcontext.restore();\n}\n\nfunction Img(src) {\n\treturn new Promise(function(resolve, reject) {\n\t\tvar img = new Image();\n\t\timg.src = src;\n\t\timg.onload = function() {\n\t\t\tresolve(img);\n\t\t}\n\t});\n}\n\nfunction drawImage({\n\timage,\n\tdx,\n\tdy,\n\tsx = 0,\n\tsy = 0,\n\tsWidth,\n\tsHeight,\n\tdWidth,\n\tdHeight,\n\trotation = 0,\n} = {}) {\n\tvar self = this;\n\timage.then(function(img){\n\t\tif (typeof sWidth === 'undefined') sWidth = img.naturalWidth;\n\t\tif (typeof dWidth === 'undefined') dWidth = img.naturalWidth;\n\t\tif (typeof sHeight === 'undefined') sHeight = img.naturalHeight;\n\t\tif (typeof dHeight === 'undefined') dHeight = img.naturalHeight;\n\n\t\tvar center = {\n\t\t\tx: dx + (dWidth * .5),\n\t\t\ty: dy + (dHeight * .5),\n\t\t}\n\n\t\tcontext.save();\n\t\tcontext.translate(center.x, center.y);\n\t\tcontext.rotate(rotation * (Math.PI / 180));\n\t\tcontext.translate(-center.x, -center.y);\n\n\n\t\tcontext.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);\n\t\n\t\tcontext.restore();\n\t})\n}\n\nmodule.exports = {\n\tclear,\n\tcanvas,\n\tcontext,\n\tdrawRectangle,\n\tImg,\n\tdrawImage,\n\tdrawText,\n\tdrawCircle,\n};\n\n\n\n//# sourceURL=webpack:///./framework/graphics.js?");

/***/ }),

/***/ "./framework/input.js":
/*!****************************!*\
  !*** ./framework/input.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function Mouse() {\n\tlet that = {\n\t\tmouseDown: [],\n\t\tmouseUp: [],\n\t\tmouseMove: [],\n\t\thandlersDown: [],\n\t\thandlersUp: [],\n\t\thandlersMove: []\n\t};\n\t\n\tfunction mouseDown(e) {\n\t\tthat.mouseDown.push(e);\n\t}\n\t\n\tfunction mouseUp(e) {\n\t\tthat.mouseUp.push(e);\n\t}\n\t\n\tfunction mouseMove(e) {\n\t\tthat.mouseMove.push(e);\n\t}\n\t\n\tthat.update = function(elapsedTime) {\n\t\tlet event;\n\t\tlet handler;\n\n\t\t//\n\t\t// Process the mouse events for each of the different kinds of handlers\n\t\tfor (event = 0; event < that.mouseDown.length; event++) {\n\t\t\tfor (handler = 0; handler < that.handlersDown.length; handler++) {\n\t\t\t\tthat.handlersDown[handler](that.mouseDown[event], elapsedTime);\n\t\t\t}\n\t\t}\n\t\t\n\t\tfor (event = 0; event < that.mouseUp.length; event++) {\n\t\t\tfor (handler = 0; handler < that.handlersUp.length; handler++) {\n\t\t\t\tthat.handlersUp[handler](that.mouseUp[event], elapsedTime);\n\t\t\t}\n\t\t}\n\t\t\n\t\tfor (event = 0; event < that.mouseMove.length; event++) {\n\t\t\tfor (handler = 0; handler < that.handlersMove.length; handler++) {\n\t\t\t\tthat.handlersMove[handler](that.mouseMove[event], elapsedTime);\n\t\t\t}\n\t\t}\n\t\t\n\t\t//\n\t\t// Now that we have processed all the inputs, reset everything back to the empty state\n\t\tthat.mouseDown.length = 0;\n\t\tthat.mouseUp.length = 0;\n\t\tthat.mouseMove.length = 0;\n\t};\n\t\n\tthat.registerCommand = function(type, handler) {\n\t\tif (type === 'mousedown') {\n\t\t\tthat.handlersDown.push(handler);\n\t\t}\n\t\telse if (type === 'mouseup') {\n\t\t\tthat.handlersUp.push(handler);\n\t\t}\n\t\telse if (type === 'mousemove') {\n\t\t\tthat.handlersMove.push(handler);\n\t\t}\n\t};\n\t\n\twindow.addEventListener('mousedown', mouseDown);\n\twindow.addEventListener('mouseup', mouseUp);\n\twindow.addEventListener('mousemove', mouseMove);\n\t\n\treturn that;\n}\n\nfunction Keyboard() {\n\tlet that = {\n\t\t\tkeys: {},\n\t\t\thandlers: []\n\t\t};\n\t\n\tfunction keyPress(e) {\n\t\tthat.keys[e.keyCode] = e.timeStamp;\n\t}\n\t\n\tfunction keyRelease(e) {\n\t\tdelete that.keys[e.keyCode];\n\t}\n\t\n\t// ------------------------------------------------------------------\n\t//\n\t// Allows the client code to register a keyboard handler\n\t//\n\t// ------------------------------------------------------------------\n\tthat.registerCommand = function(key, handler) {\n\t\tthat.handlers.push({ key: key, handler: handler });\n\t};\n\t\n\t// ------------------------------------------------------------------\n\t//\n\t// Allows the client to invoke all the handlers for the registered key/handlers.\n\t//\n\t// ------------------------------------------------------------------\n\tthat.update = function(elapsedTime) {\n\t\tlet key = 0;\n\n\t\tfor (key = 0; key < that.handlers.length; key++) {\n\t\t\tif (typeof that.keys[that.handlers[key].key] !== 'undefined') {\n\t\t\t\tthat.handlers[key].handler(elapsedTime);\n\t\t\t}\n\t\t}\n\t};\n\t\n\t//\n\t// These are used to keep track of which keys are currently pressed\n\twindow.addEventListener('keydown', keyPress);\n\twindow.addEventListener('keyup', keyRelease);\n\t\n\treturn that;\n}\n\n//------------------------------------------------------------------\n//\n// Source: http://stackoverflow.com/questions/1465374/javascript-event-keycode-constants\n//\n//------------------------------------------------------------------\nlet KeyEvent = {\n\tDOM_VK_CANCEL: 3,\n\tDOM_VK_HELP: 6,\n\tDOM_VK_BACK_SPACE: 8,\n\tDOM_VK_TAB: 9,\n\tDOM_VK_CLEAR: 12,\n\tDOM_VK_RETURN: 13,\n\tDOM_VK_ENTER: 14,\n\tDOM_VK_SHIFT: 16,\n\tDOM_VK_CONTROL: 17,\n\tDOM_VK_ALT: 18,\n\tDOM_VK_PAUSE: 19,\n\tDOM_VK_CAPS_LOCK: 20,\n\tDOM_VK_ESCAPE: 27,\n\tDOM_VK_SPACE: 32,\n\tDOM_VK_PAGE_UP: 33,\n\tDOM_VK_PAGE_DOWN: 34,\n\tDOM_VK_END: 35,\n\tDOM_VK_HOME: 36,\n\tDOM_VK_LEFT: 37,\n\tDOM_VK_UP: 38,\n\tDOM_VK_RIGHT: 39,\n\tDOM_VK_DOWN: 40,\n\tDOM_VK_PRINTSCREEN: 44,\n\tDOM_VK_INSERT: 45,\n\tDOM_VK_DELETE: 46,\n\tDOM_VK_0: 48,\n\tDOM_VK_1: 49,\n\tDOM_VK_2: 50,\n\tDOM_VK_3: 51,\n\tDOM_VK_4: 52,\n\tDOM_VK_5: 53,\n\tDOM_VK_6: 54,\n\tDOM_VK_7: 55,\n\tDOM_VK_8: 56,\n\tDOM_VK_9: 57,\n\tDOM_VK_SEMICOLON: 59,\n\tDOM_VK_EQUALS: 61,\n\tDOM_VK_A: 65,\n\tDOM_VK_B: 66,\n\tDOM_VK_C: 67,\n\tDOM_VK_D: 68,\n\tDOM_VK_E: 69,\n\tDOM_VK_F: 70,\n\tDOM_VK_G: 71,\n\tDOM_VK_H: 72,\n\tDOM_VK_I: 73,\n\tDOM_VK_J: 74,\n\tDOM_VK_K: 75,\n\tDOM_VK_L: 76,\n\tDOM_VK_M: 77,\n\tDOM_VK_N: 78,\n\tDOM_VK_O: 79,\n\tDOM_VK_P: 80,\n\tDOM_VK_Q: 81,\n\tDOM_VK_R: 82,\n\tDOM_VK_S: 83,\n\tDOM_VK_T: 84,\n\tDOM_VK_U: 85,\n\tDOM_VK_V: 86,\n\tDOM_VK_W: 87,\n\tDOM_VK_X: 88,\n\tDOM_VK_Y: 89,\n\tDOM_VK_Z: 90,\n\tDOM_VK_CONTEXT_MENU: 93,\n\tDOM_VK_NUMPAD0: 96,\n\tDOM_VK_NUMPAD1: 97,\n\tDOM_VK_NUMPAD2: 98,\n\tDOM_VK_NUMPAD3: 99,\n\tDOM_VK_NUMPAD4: 100,\n\tDOM_VK_NUMPAD5: 101,\n\tDOM_VK_NUMPAD6: 102,\n\tDOM_VK_NUMPAD7: 103,\n\tDOM_VK_NUMPAD8: 104,\n\tDOM_VK_NUMPAD9: 105,\n\tDOM_VK_MULTIPLY: 106,\n\tDOM_VK_ADD: 107,\n\tDOM_VK_SEPARATOR: 108,\n\tDOM_VK_SUBTRACT: 109,\n\tDOM_VK_DECIMAL: 110,\n\tDOM_VK_DIVIDE: 111,\n\tDOM_VK_F1: 112,\n\tDOM_VK_F2: 113,\n\tDOM_VK_F3: 114,\n\tDOM_VK_F4: 115,\n\tDOM_VK_F5: 116,\n\tDOM_VK_F6: 117,\n\tDOM_VK_F7: 118,\n\tDOM_VK_F8: 119,\n\tDOM_VK_F9: 120,\n\tDOM_VK_F10: 121,\n\tDOM_VK_F11: 122,\n\tDOM_VK_F12: 123,\n\tDOM_VK_F13: 124,\n\tDOM_VK_F14: 125,\n\tDOM_VK_F15: 126,\n\tDOM_VK_F16: 127,\n\tDOM_VK_F17: 128,\n\tDOM_VK_F18: 129,\n\tDOM_VK_F19: 130,\n\tDOM_VK_F20: 131,\n\tDOM_VK_F21: 132,\n\tDOM_VK_F22: 133,\n\tDOM_VK_F23: 134,\n\tDOM_VK_F24: 135,\n\tDOM_VK_NUM_LOCK: 144,\n\tDOM_VK_SCROLL_LOCK: 145,\n\tDOM_VK_COMMA: 188,\n\tDOM_VK_PERIOD: 190,\n\tDOM_VK_SLASH: 191,\n\tDOM_VK_BACK_QUOTE: 192,\n\tDOM_VK_OPEN_BRACKET: 219,\n\tDOM_VK_BACK_SLASH: 220,\n\tDOM_VK_CLOSE_BRACKET: 221,\n\tDOM_VK_QUOTE: 222,\n\tDOM_VK_META: 224\n};\n\nmodule.exports = {\n\tKeyboard,\n\tKeyEvent,\n\tMouse,\n};\n\n//# sourceURL=webpack:///./framework/input.js?");

/***/ }),

/***/ "./game/scripts/about.js":
/*!*******************************!*\
  !*** ./game/scripts/about.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\r\nfunction initialize() {\r\n\tconst showScreen = __webpack_require__(/*! ./showScreen */ \"./game/scripts/showScreen.js\");\r\n\tconst mainMenu = __webpack_require__(/*! ./mainmenu */ \"./game/scripts/mainmenu.js\");\r\n\tdocument.getElementById('id-about-back').addEventListener(\r\n\t\t'click',\r\n\t\tfunction() { showScreen(mainMenu); });\r\n}\r\n\r\nfunction run() {\r\n\t//\r\n\t// I know this is empty, there isn't anything to do.\r\n}\r\n\r\nmodule.exports = {\r\n\tinitialize: initialize,\r\n\trun: run,\r\n\tid: 'about'\r\n};\r\n\n\n//# sourceURL=webpack:///./game/scripts/about.js?");

/***/ }),

/***/ "./game/scripts/game.js":
/*!******************************!*\
  !*** ./game/scripts/game.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const screens = __webpack_require__(/*! ./screens */ \"./game/scripts/screens.js\");\r\nconst showScreen = __webpack_require__(/*! ./showScreen */ \"./game/scripts/showScreen.js\");\r\nconst mainMenu = __webpack_require__(/*! ./mainmenu */ \"./game/scripts/mainmenu.js\");\r\n\r\n//------------------------------------------------------------------\r\n//\r\n// This function performs the one-time game initialization.\r\n//\r\n//------------------------------------------------------------------\r\nfunction initialize() {\r\n\tlet screen = null;\r\n\r\n\t// Go through each of the screens and tell them to initialize\r\n\tfor (screen in screens) {\r\n\t\tif (screens.hasOwnProperty(screen)) {\r\n\t\t\tscreens[screen].initialize();\r\n\t\t}\r\n\t}\r\n\t\r\n\t// Make the main-menu screen the active one\r\n\tshowScreen(mainMenu);\r\n}\r\n\r\nwindow.onload = function() {\r\n\tinitialize();\r\n};\r\n\n\n//# sourceURL=webpack:///./game/scripts/game.js?");

/***/ }),

/***/ "./game/scripts/gameplay.js":
/*!**********************************!*\
  !*** ./game/scripts/gameplay.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const graphics = __webpack_require__(/*! ../../framework/graphics */ \"./framework/graphics.js\");\r\nconst input = __webpack_require__(/*! ../../framework/input */ \"./framework/input.js\");\r\nconst showScreen = __webpack_require__(/*! ./showScreen */ \"./game/scripts/showScreen.js\");\r\nconst mainMenu = __webpack_require__(/*! ./mainmenu */ \"./game/scripts/mainmenu.js\");\r\n\r\nvar mouseCapture = false,\r\n\tmyMouse = input.Mouse(),\r\n\tmyKeyboard = input.Keyboard(),\r\n\tmyTexture = null,\r\n\tcancelNextRequest = false,\r\n\tlastTimeStamp;\r\n\r\nfunction initialize() {\r\n\tconsole.log('game initializing...');\r\n\r\n\t// Create the keyboard input handler and register the keyboard commands\r\n\t// myKeyboard.registerCommand(KeyEvent.DOM_VK_A, myTexture.moveLeft);\r\n\t// myKeyboard.registerCommand(KeyEvent.DOM_VK_D, myTexture.moveRight);\r\n\t// myKeyboard.registerCommand(KeyEvent.DOM_VK_W, myTexture.moveUp);\r\n\t// myKeyboard.registerCommand(KeyEvent.DOM_VK_S, myTexture.moveDown);\r\n\t// myKeyboard.registerCommand(KeyEvent.DOM_VK_Q, myTexture.rotateLeft);\r\n\t// myKeyboard.registerCommand(KeyEvent.DOM_VK_E, myTexture.rotateRight);\r\n\tmyKeyboard.registerCommand(input.KeyEvent.DOM_VK_ESCAPE, function() {\r\n\r\n\t\t// Stop the game loop by canceling the request for the next animation frame\r\n\t\tcancelNextRequest = true;\r\n\r\n\t\t// Then, return to the main menu\r\n\t\tshowScreen(mainMenu);\r\n\t});\r\n\t\r\n\t// Create an ability to move the logo using the mouse\r\n\tmyMouse = input.Mouse();\r\n\tmyMouse.registerCommand('mousedown', function(e) {\r\n\t\tmouseCapture = true;\r\n\t\t// myTexture.moveTo({x: e.clientX, y: e.clientY});\r\n\t});\r\n\r\n\tmyMouse.registerCommand('mouseup', function() {\r\n\t\tmouseCapture = false;\r\n\t});\r\n\r\n\tmyMouse.registerCommand('mousemove', function(e) {\r\n\t\tif (mouseCapture) {\r\n\t\t\t// myTexture.moveTo({x: e.clientX, y: e.clientY});\r\n\t\t}\r\n\t});\r\n}\r\n\r\nfunction update(elapsedTime) {\r\n\tmyKeyboard.update(elapsedTime);\r\n\tmyMouse.update(elapsedTime);\r\n}\r\n\r\nfunction render() {\r\n\tgraphics.clear();\r\n\t// myTexture.draw();\r\n}\r\n\r\n//------------------------------------------------------------------\r\n//\r\n// This is the Game Loop function!\r\n//\r\n//------------------------------------------------------------------\r\nfunction gameLoop(time) {\r\n\t\r\n\tupdate(time - lastTimeStamp);\r\n\tlastTimeStamp = time;\r\n\t\r\n\trender();\r\n\r\n\tif (!cancelNextRequest) {\r\n\t\trequestAnimationFrame(gameLoop);\r\n\t}\r\n}\r\n\r\nfunction run() {\r\n\tlastTimeStamp = performance.now();\r\n\r\n\t// Start the animation loop\r\n\tcancelNextRequest = false;\r\n\trequestAnimationFrame(gameLoop);\r\n}\r\n\r\nmodule.exports = {\r\n\tinitialize: initialize,\r\n\trun: run,\r\n\tid: 'game-play'\r\n};\r\n\n\n//# sourceURL=webpack:///./game/scripts/gameplay.js?");

/***/ }),

/***/ "./game/scripts/help.js":
/*!******************************!*\
  !*** ./game/scripts/help.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\r\nfunction initialize() {\r\n\tconst showScreen = __webpack_require__(/*! ./showScreen */ \"./game/scripts/showScreen.js\");\r\n\tconst mainMenu = __webpack_require__(/*! ./mainmenu */ \"./game/scripts/mainmenu.js\");\r\n\tdocument.getElementById('id-help-back').addEventListener(\r\n\t\t'click',\r\n\t\tfunction() { showScreen(mainMenu); });\r\n}\r\n\r\nfunction run() {\r\n\t//\r\n\t// I know this is empty, there isn't anything to do.\r\n}\r\n\r\nmodule.exports = {\r\n\tinitialize: initialize,\r\n\trun: run,\r\n\tid: 'help'\r\n};\r\n\n\n//# sourceURL=webpack:///./game/scripts/help.js?");

/***/ }),

/***/ "./game/scripts/highscores.js":
/*!************************************!*\
  !*** ./game/scripts/highscores.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\r\nfunction initialize() {\r\n\tconst showScreen = __webpack_require__(/*! ./showScreen */ \"./game/scripts/showScreen.js\");\r\n\tconst mainMenu = __webpack_require__(/*! ./mainmenu */ \"./game/scripts/mainmenu.js\");\r\n\tdocument.getElementById('id-high-scores-back').addEventListener(\r\n\t\t'click',\r\n\t\tfunction() { showScreen(mainMenu); });\r\n}\r\n\r\nfunction run() {\r\n\t//\r\n\t// I know this is empty, there isn't anything to do.\r\n}\r\n\r\nmodule.exports = {\r\n\tinitialize: initialize,\r\n\trun: run,\r\n\tid: 'high-scores'\r\n};\r\n\n\n//# sourceURL=webpack:///./game/scripts/highscores.js?");

/***/ }),

/***/ "./game/scripts/mainmenu.js":
/*!**********************************!*\
  !*** ./game/scripts/mainmenu.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\r\nfunction initialize() {\r\n\tconst showScreen = __webpack_require__(/*! ./showScreen */ \"./game/scripts/showScreen.js\");\r\n\tconst gamePlay = __webpack_require__(/*! ./gameplay */ \"./game/scripts/gameplay.js\");\r\n\tconst highScores = __webpack_require__(/*! ./highscores */ \"./game/scripts/highscores.js\");\r\n\tconst help = __webpack_require__(/*! ./help */ \"./game/scripts/help.js\");\r\n\tconst about = __webpack_require__(/*! ./about */ \"./game/scripts/about.js\");\r\n\t// Setup each of menu events for the screens\r\n\tdocument.getElementById('id-new-game').addEventListener(\r\n\t\t'click',\r\n\t\tfunction() {showScreen(gamePlay); });\r\n\t\r\n\tdocument.getElementById('id-high-scores').addEventListener(\r\n\t\t'click',\r\n\t\tfunction() { showScreen(highScores); });\r\n\t\r\n\tdocument.getElementById('id-help').addEventListener(\r\n\t\t'click',\r\n\t\tfunction() { showScreen(help); });\r\n\t\r\n\tdocument.getElementById('id-about').addEventListener(\r\n\t\t'click',\r\n\t\tfunction() { showScreen(about); });\r\n}\r\n\r\nfunction run() {\r\n\t// I know this is empty, there isn't anything to do.\r\n}\r\n\r\nmodule.exports = {\r\n\tinitialize: initialize,\r\n\trun: run,\r\n\tid: 'main-menu'\r\n};\r\n\n\n//# sourceURL=webpack:///./game/scripts/mainmenu.js?");

/***/ }),

/***/ "./game/scripts/screens.js":
/*!*********************************!*\
  !*** ./game/scripts/screens.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const about = __webpack_require__(/*! ./about */ \"./game/scripts/about.js\");\nconst help = __webpack_require__(/*! ./help */ \"./game/scripts/help.js\");\nconst gameplay = __webpack_require__(/*! ./gameplay */ \"./game/scripts/gameplay.js\");\nconst mainmenu = __webpack_require__(/*! ./mainmenu */ \"./game/scripts/mainmenu.js\");\nconst highScores = __webpack_require__(/*! ./highscores */ \"./game/scripts/highscores.js\");\n\nconst screens = {\n    about,\n    help,\n    'game-play': gameplay,\n    'main-menu': mainmenu,\n    'high-scores': highScores\n};\n\nmodule.exports = screens;\n\n//# sourceURL=webpack:///./game/scripts/screens.js?");

/***/ }),

/***/ "./game/scripts/showScreen.js":
/*!************************************!*\
  !*** ./game/scripts/showScreen.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = function showScreen(screen) {\n\tlet screenIndex = 0;\n\tlet active = null;\n\n\tactive = document.getElementsByClassName('active');\n\tfor (screenIndex = 0; screenIndex < active.length; screenIndex++) {\n\t\tactive[screenIndex].classList.remove('active');\n\t}\n\n\t// Tell the screen to start actively running\n\tscreen.run();\n\n\t// Then, set the new screen to be active\n\tdocument.getElementById(screen.id).classList.add('active');\n}\n\n//# sourceURL=webpack:///./game/scripts/showScreen.js?");

/***/ })

/******/ });