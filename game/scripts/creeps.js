const graphics = require('../../framework/graphics');
const map = require('./map');
var m_map = map.map;

var CreepType = {
    ALIEN: 0,
    TANK: 1,
    SHIP: 2,
    SHIP: 3,
    ROBOT: 4
};

const amountOfCreatures = 29;

var creaturesImage = graphics.Img("creatures.png");

//const creatureHeight = creaturesImage.height / amountOfCreatures;
//const creatureWidth = creaturesImage.width / 4;

var creep = function ({
    type = CreepType.ALIEN,
    pos = {
        x,
        y
    },
    goal = {
        x,
        y
    }
} = {}) {
    var that = {};
    let rot = 0;
    let speed = 40;
    var myPath = m_map.shortestPath(pos, goal);
    let creatureWidth = 30;
    let creatureHeight = 40;
    that.myPos = {
    x: pos.x*1000/map.rowColSize + map.rowColSize/2,
    y: pos.y*1000/map.rowColSize + map.rowColSize/2}
    let pic = 0;
    let lastPicMove = 0;
    let rotatePicTime = 333;

    that.render = function () {
        graphics.drawImage({
            image: creaturesImage,
            dx: that.myPos.x,
            dy: that.myPos.y,
            sx: pic * creatureWidth,
            sy: type * creatureHeight,
            sWidth: creatureWidth,
            sHeight: creatureHeight,
            dWidth: creatureWidth,
            dHeight: creatureHeight,
            rotation: rot,
        });
        // graphics.drawRectangle({
        //     x: myPos.x,
        //     y: myPos.y,
        //     w: 10,
        //     h: 10,
        //     fill: '#F00F00',
        //     stroke: '#FA3498',
        // })
    }

    that.update = function (elapsedTime) {
        var diffx = myPath[0].x - that.myPos.x;
        var distanceToTraverse = speed * elapsedTime / 1000;
        if (Math.abs(diffx) > distanceToTraverse) {
            that.myPos.x += distanceToTraverse * Math.sign(diffx);
            rot = 0;
        } else {
            that.myPos.x = myPath[0].x;
        }
        
        var diffy = myPath[0].y - that.myPos.y;
        var distanceToTraverse = speed * elapsedTime / 1000;
        if (Math.abs(diffy) > distanceToTraverse) {
            that.myPos.y += distanceToTraverse * Math.sign(diffy);
            //rot = -Math.PI/2; // confused if we need to do this
        } else {
            that.myPos.y = myPath[0].y;
        }

        if (that.myPos.x === myPath[0].x && that.myPos.y === myPath[0].y) {
            if(myPath.length === 1) return true;
            myPath.shift();
            //rot = diffx > diffy ? 0 : -Math.PI / 2;
        }
        // update rot
        lastPicMove += elapsedTime;
        if(lastPicMove > rotatePicTime) {
            pic = (pic + 1)%3;
            lastPicMove = 0;
        }
    }

    return that;
}


var creepSystem = function () {
    var that = {};
    var creepSystems = [];

    that.addCreepSystem = function({
    time = 10000,
    amount = 50,
    type = CreepType.ALIEN,
    startingPositions, // array of starting positions
    endingPositions,
    } = {}) {
        creepSystems.push({time, amount, type, startingPositions, endingPositions, creepsMade: 0, timePassed: 0});
    }
    var creeps = [];

    that.render = function () {
        for (let i = 0; i < creeps.length; i++) {
            creeps[i].render();
        }
    }

    that.update = function (elapsedTime) {
        for (let i = 0; i < creeps.length; i++) {
            if(creeps[i].update(elapsedTime)) {
                creeps.splice(i,1);
                i--;
                //decrement lives
            }
        }
        for(let i = 0; i < creepSystems.length; i++) {
            creepSystems[i].timePassed += elapsedTime;
            if (creepSystems[i].creepsMade < creepSystems[i].amount && creepSystems[i].time / creepSystems[i].amount < creepSystems[i].timePassed) {
                creeps.push(creep({
                    type: creepSystems[i].type,
                    pos: creepSystems[i].startingPositions[Math.floor(Math.random() * creepSystems[i].startingPositions.length)],
                    goal: creepSystems[i].endingPositions[Math.floor(Math.random() * creepSystems[i].endingPositions.length)],
                }));
                creepSystems[i].creepsMade++;
                creepSystems[i].timePassed = 0;
            }
        }
    }

    that.findNextCreep = function({x, y}, range) {
        for(let i = 0; i < creeps.length; i++) {
            if(m_map.calcDist({x,y}, creeps[i].myPos) < range) {
                return creeps[i];
            }
        }
    }

    return that;
}

var m_creepSystem = creepSystem();

module.exports = {
    creepSystem: m_creepSystem,
    CreepType,
    id: 'creep'
};
