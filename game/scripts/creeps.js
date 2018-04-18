const graphics = require('../../framework/graphics');
const map = require('./map');
var m_map = map.map;

var CreepType = {
    FIREWOOF: 0,
    EYEBALL: 1,
    JETSTER: 2,
};

var creatureWidth = 32;
var creatureHeight = 32;
var showSize = 50;

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
        that.myPos = {
        x: pos.x*1000/map.rowColSize + map.rowColSize/2,
        y: pos.y*1000/map.rowColSize + map.rowColSize/2}
        let rot = 0;
        let speed = 40;
        var myPath = m_map.shortestPath(pos, goal);
        
        switch(type) {
            case CreepType.EYEBALL:
            var creaturesImage = "eyebawl.png";
            break;
            case CreepType.FIREWOOF:
            var creaturesImage = "firewoof.png";
            break;
            case CreepType.JETSTER:
            var creaturesImage = "jetster.png";
            break;
        }
        var m_sprite = graphics.SpriteSheet({
            sprite: 0,
            elapsedTime: 0,
            center: that.myPos,
            rotation: 0,
            width: creatureWidth,
            height: creatureWidth,
            spriteCount: 3,
            src: creaturesImage,
            spriteTime: 300,
            reverseOnFinish: true,
            horizontalFlip: true
        });

    that.render = function () {
        m_sprite.draw();
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
        } else {
            that.myPos.y = myPath[0].y;
        }

        if (that.myPos.x === myPath[0].x && that.myPos.y === myPath[0].y) {
            if(myPath.length === 1) return true;
            myPath.shift();
        }
        m_sprite.update(elapsedTime);
        m_sprite.updatePosition({x:that.myPos.x, y:that.myPos.y});
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
