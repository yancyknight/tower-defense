const graphics = require('../../framework/graphics');
const map = require('./map');
var m_map = map.map;
const collision = require('../../framework/collision');
const audio = require('./audio');
const pointsSystem = require('./points').floatingPointSystem;
const particleSystem = require('../../framework/ParticleSystem').ParticleSystemManager();

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
    that.goal = goal;
    that.type = type;
        
    that.myPos = {
        x: pos.x*1000/map.rowColSize + map.rowColSize/2,
        y: pos.y*1000/map.rowColSize + map.rowColSize/2
    }
    let rot = 0;
    let speed = 40;
    that.health = 1000;
    var maxHealth = that.health;
    var points = 10;
    var healthPercent;
    var barFill;
    
    switch(that.type) {
        case CreepType.EYEBALL:
        var creaturesImage = "eyebawl.png";
        that.myPath = m_map.shortestPath(pos, goal);
        break;
        case CreepType.FIREWOOF:
        var creaturesImage = "firewoof.png";
        that.myPath = m_map.shortestPath(pos, goal);
        break;
        case CreepType.JETSTER:
        var creaturesImage = "jetster.png";
        that.myPath = m_map.directPath(pos, goal);
        break;
    }

    that.getBoundingBox = function() {
        return {
            x: that.myPos.x,
            y: that.myPos.y,
            w: creatureWidth,
            h: creatureHeight
        }
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
        if(healthPercent !== 1) { 
            graphics.drawRectangle({
                x: that.myPos.x,
                y: that.myPos.y - 20,
                w: healthPercent*25,
                h: 10,
                fill: barFill
            });
        }
    }

    that.update = function (elapsedTime) {
        if(that.health < 1) {
            audio.die();
            pointsSystem.addFloatingPoint({
                num: points,
                pos: that.myPos
            });
            vm.money += points;
            particleSystem.addParticleSystem(that.myPos, {
                speedmean: .1, speedstdev: 0.04,
                lifetimemean: 500,lifetimestdev: 300,
                sizemean: 10, sizestdev: 1,
                fill: 'rgba(0, 255, 255, 0.75)',
                stroke: 'rgba(0, 255, 0, 0.5)',
                image: './firework.png',
                amount: 200,
                style: 'image',
                imagedHeight: 20,
                imagedWidth: 20
            });

            return true;
        }
        healthPercent = that.health / maxHealth;
        if(healthPercent !== 1){
            if(healthPercent > .5) barFill = '#00FF00';
            else if(healthPercent > .25) barFill = '#FFFF00';
            else barFill = '#FF0000';
        }
        var diffx = that.myPath[0].x - that.myPos.x; // TODO: at some random occurance, this dies
        var distanceToTraverse = speed * elapsedTime / 1000;
        if (Math.abs(diffx) > distanceToTraverse) {
            that.myPos.x += distanceToTraverse * Math.sign(diffx);
            rot = 0;
        } else {
            that.myPos.x = that.myPath[0].x;
        }
        
        var diffy = that.myPath[0].y - that.myPos.y;
        var distanceToTraverse = speed * elapsedTime / 1000;
        if (Math.abs(diffy) > distanceToTraverse) {
            that.myPos.y += distanceToTraverse * Math.sign(diffy);
        } else {
            that.myPos.y = that.myPath[0].y;
        }

        if (that.myPos.x === that.myPath[0].x && that.myPos.y === that.myPath[0].y) {
            if(that.myPath.length === 1) {
                vm.lives -= 1;
                return true;
            }
            that.myPath.shift();

        }
        m_sprite.update(elapsedTime);
        m_sprite.updatePosition({x:that.myPos.x, y:that.myPos.y});
    }

    return that;
}


var creepSystem = function () {
    var that = {};
    var creepSystems = [];
    var hasCreeps = false;
    var creeps = [];

    that.addCreepSystem = function({
        time = 10000,
        amount = 50,
        type = CreepType.ALIEN,
        startingPositions, // array of starting positions
        endingPositions,
    } = {}) {
        creepSystems.push({time, amount, type, startingPositions, endingPositions, creepsMade: 0, timePassed: 0});
    }

    that.render = function () {
        for (let i = 0; i < creeps.length; i++) {
            creeps[i].render();
        }
        particleSystem.render();
    }

    that.update = function (elapsedTime) {
        for (let i = 0; i < creeps.length; i++) {
            if(creeps[i].update(elapsedTime)) {
                creeps.splice(i,1);
                i--;
                //decrement lives
                if(hasCreeps && creeps.length == 0) {
                    hasCreeps = false;
                    vm.$emit('level-complete');
                }
            }
        }
        for(let i = 0; i < creepSystems.length; i++) {
            creepSystems[i].timePassed += elapsedTime;
            if (creepSystems[i].creepsMade < creepSystems[i].amount && creepSystems[i].time / creepSystems[i].amount < creepSystems[i].timePassed) {
                hasCreeps = true;
                creeps.push(creep({
                    type: creepSystems[i].type,
                    pos: creepSystems[i].startingPositions[Math.floor(Math.random() * creepSystems[i].startingPositions.length)],
                    goal: creepSystems[i].endingPositions[Math.floor(Math.random() * creepSystems[i].endingPositions.length)],
                }));
                creepSystems[i].creepsMade++;
                creepSystems[i].timePassed = 0;
            }
        }
        particleSystem.update(elapsedTime);        
    }

    that.resetAllPaths = function() {
        for(let i = 0; i < creeps.length; i++) {
            var creep = creeps[i];
            if(creep.type < 2)
                creep.myPath = m_map.shortestPath({x:Math.floor(creep.myPos.x/1000*map.rowColSize), 
                                               y:Math.floor(creep.myPos.y/1000*map.rowColSize)},
                                               creep.goal);
            else
                creep.myPath = m_map.directPath({x:Math.floor(creep.myPos.x/1000*map.rowColSize), 
                    y:Math.floor(creep.myPos.y/1000*map.rowColSize)},
                    creep.goal);
        }
    }

    that.foreach = function(func) {
        for(let i = 0; i < creeps.length; i++) {
            func(creeps[i]);
        }
    }

    that.explodeNearCreeps = function(bullet) {
        for(let i = 0; i < creeps.length; i++) {
            if(Math.sqrt(Math.pow(creeps[i].myPos.x - bullet.myPos.x, 2) + 
               Math.pow(creeps[i].myPos.y - bullet.myPos.y,2)) < bullet.explodeRange) {
                creeps[i].health -= bullet.damage;
            }
        }
    }

    function calcDist(a, b) {
        return Math.sqrt(Math.pow(a.x-b.x, 2) + Math.pow(a.y-b.y, 2));
    }

    that.findNextCreep = function({x, y}, range) {
        for(let i = 0; i < creeps.length; i++) {
            if(calcDist({x,y}, {x:creeps[i].myPos.x+16, y:creeps[i].myPos.y+16}) < range) {
                return creeps[i];
            }
        }
    }

    that.initialize = function() {
        creepSystems = [];
        creeps = [];
        hasCreeps = false;
    }

    return that;
}

var m_creepSystem = creepSystem();

module.exports = {
    creepSystem: m_creepSystem,
    CreepType
};
