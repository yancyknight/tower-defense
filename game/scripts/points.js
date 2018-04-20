const graphics = require('../../framework/graphics');

var pointsWidth = 32;
var pointsHeight = 32;

var floatingPoint = function({num, pos}) {
    var that = {};
    var timeLeft = 1000;

    that.update = function(elapsedTime) {
        timeLeft -= elapsedTime;
        if(timeLeft < 0) return true;
        pos.y-=elapsedTime*.01;
    }

    that.render = function() {
        graphics.drawText({text:JSON.stringify(num), x:pos.x, y:pos.y, fill:'#FFFFFF', font: '20px serif'});
    }

    return that;
}

var floatingPointSystem = function () {
    var that = {};
    var floatingPoints = [];

    that.addFloatingPoint = function({
        num = 0,
        pos = {
            x,
            y
        }
    } = {}) {
        floatingPoints.push(floatingPoint({num, pos}));
    }

    that.render = function () {
        for (let i = 0; i < floatingPoints.length; i++) {
            floatingPoints[i].render();
        }
    }

    that.update = function (elapsedTime) {
        for (let i = 0; i < floatingPoints.length; i++) {
            if(floatingPoints[i].update(elapsedTime)) {
                floatingPoints.splice(i,1);
                i--;
            }
        }
    }
    return that;
}

var m_floatingPointSystem = floatingPointSystem();

module.exports = {
    floatingPointSystem: m_floatingPointSystem
};
