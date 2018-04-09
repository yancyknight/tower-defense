const about = require('./about');
const help = require('./help');
const gameplay = require('./gameplay');
const mainmenu = require('./mainmenu');
const highScores = require('./highscores');

const screens = {
    about,
    help,
    'game-play': gameplay,
    'main-menu': mainmenu,
    'high-scores': highScores
};

module.exports = screens;