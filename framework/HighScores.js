'use strict';
const storage = require('node-persist');
const HIGH_SCORES = "MyGamehighScores";

storage.init();

async function getScores() {
    var val = await storage.getItem(HIGH_SCORES);
    if(val === undefined) {
        return [];
    }
    return val;
}

function sortNumber(a, b) {
    return b.score - a.score;
}

async function addScore({name, score}){
    let highScores = await storage.getItem(HIGH_SCORES);
    if (highScores === undefined) {
        highScores = [{name, score}];
        storage.setItem(HIGH_SCORES, highScores);
        return highScores;
    }
    highScores.push({name, score});
    highScores.sort(sortNumber);
    highScores.length = Math.min(highScores.length, 10);
    storage.setItem(HIGH_SCORES, highScores);
    return highScores
}

function removeScore(){
    storage.removeItem(HIGH_SCORES);
}

module.exports = {
    getScores,
	addScore,
	removeScore,
};

