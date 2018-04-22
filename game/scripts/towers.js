const graphics = require('../../framework/graphics');
const map = require('./map');
var m_map = map.map;
const creepSystem = require('./creeps').creepSystem;
const bulletSystem = require('./bullets');
var m_bulletSystem = bulletSystem.bulletSystem;
const collision = require('./collision');
const audio = require('./audio');

var TowerType = {
    GROUND1: 0,
    GROUND2: 1,
    AIR1: 2,
    AIR2: 3
};

var TowerTypeNames = {
    0: 'GROUND1',
    1: 'GROUND2',
    2: 'AIR1',
    3: 'AIR2'
};

var towerBullets = {
    "0": bulletSystem.BulletType.BULLET,
    "1": bulletSystem.BulletType.BOMB,
    "2": bulletSystem.BulletType.BULLET,
    "3": bulletSystem.BulletType.ROCKET
}

var towerDamage = {
    "0": 70,
    "1": 60,
    "2": 70,
    "3": 60
}

var towerCosts = {
    GROUND1: 50,
    GROUND2: 100,
    AIR1: 50,
    AIR2: 100,
}

var towerBaseImage = graphics.Img("tankBase.png");

let towerImages = [graphics.Img("tower1.png"), graphics.Img("tower2.png"), graphics.Img("tower3.png"), graphics.Img("tower4.png")];

const baseSize = 100;

const baseStats = {
    rateOfFire: 1000,
    range: 250,
    level: 1
}

var tower = function ({
    type = TowerType.GROUND1,
    pos,
    pos: {
        x,
        y
    } = {},
    ghost = false,
    fill = 'rgba(128, 223, 255, .1)'
} = {}) {
    var that = {};
    let rot = 0;
    var sold = false;
    var stats = {
        rateOfFire: baseStats.rateOfFire,
        range: baseStats.range,
        level: baseStats.level,
        damage: towerDamage[type],
        sellAmount: Math.ceil(towerCosts[TowerTypeNames[type]] * .65)
    }

    that.stats = stats;

    that.lastFire = 0;

    var myPos = {
        x: pos.x * 1000 / map.rowColSize,
        y: pos.y * 1000 / map.rowColSize
    }

    that.pos = myPos;

    let pic = 0;
    var rotateSpeed = 12 * 3.14159 / 1000;
    var towerImage = towerImages[type];
    var towerWidth = 80;
    var towerHeight = 80;
    var imageSize = 45;

    var towerCenter = {
        x: myPos.x + 50,
        y: myPos.y + 50
    };

    that.upgrade = function() {
        if(vm.money < 150) return;
        stats.level += 1;
        stats.damage += 25;
        stats.range += 10;
        stats.rateOfFire -= 50;
        stats.sellAmount += 75;
        if(stats.rateOfFire < 0) stats.rateOfFire = 0;
        vm.money -= 150;
    }

    that.sell = function() {
        audio.sellTower();
        vm.money += stats.sellAmount;
        sold = true;
        vm.selectedTower = null;
        m_map.removeTower({x, y});
    }

    that.render = function () {
        graphics.drawImage({
            image: towerBaseImage,
            dx: myPos.x,
            dy: myPos.y,
            dWidth: baseSize,
            dHeight: baseSize,
            alpha: ghost ? .5 : 1
        });
        graphics.drawImage({
            image: towerImage,
            dx: myPos.x + (100 - towerWidth) / 2,
            dy: myPos.y + (100 - towerHeight) / 2,
            sx: 0,
            sy: 0,
            sWidth: imageSize,
            sHeight: imageSize,
            dWidth: towerWidth,
            dHeight: towerHeight,
            rotation: rot + Math.PI / 2,
            alpha: ghost ? .5 : 1
        });
        if (vm.showTowerCoverage || ghost) {
            graphics.drawCircle({
                x: towerCenter.x,
                y: towerCenter.y,
                radius: stats.range,
                fill: fill,
            });
        }
    }

    function crossProduct2d(v1, v2) {
        return (v1.x * v2.y) - (v1.y * v2.x);
    }

    function computeAngle(rotation, ptCenter, ptTarget) {
        var v1 = {
                x: Math.cos(rotation),
                y: Math.sin(rotation)
            },
            v2 = {
                x: ptTarget.x - ptCenter.x,
                y: ptTarget.y - ptCenter.y
            },
            dp,
            angle;

        v2.len = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
        v2.x /= v2.len;
        v2.y /= v2.len;

        dp = v1.x * v2.x + v1.y * v2.y;
        angle = Math.acos(dp);

        // Get the cross product of the two vectors so we can know
        // which direction to rotate.
        cp = crossProduct2d(v1, v2);

        return {
            angle: angle,
            crossProduct: cp
        };
    }


    that.update = function (elapsedTime) {
        if (sold) return false;
        that.lastFire += elapsedTime;
        //find creep to fire at
        var creep = creepSystem.findNextCreep({
            x: towerCenter.x,
            y: towerCenter.y,
        },
        type < 2 ? 'ground' : 'air',
        stats.range);
        if (creep !== undefined) {
            var angle = computeAngle(rot, {
                x: towerCenter.x,
                y: towerCenter.y
            }, {
                x: creep.myPos.x + 16,
                y: creep.myPos.y + 16
            });
            if (angle.angle < .1) {
                if (angle.crossProduct > 0) {
                    rot += angle.angle;
                } else {
                    rot -= angle.angle;
                }
                if (that.lastFire > stats.rateOfFire && !ghost) {
                    //fire!
                    var newBullet = m_bulletSystem.addBullet({
                        type:towerBullets[type], 
                        myPos:{x: towerCenter.x, y: towerCenter.y}, 
                        goal:creep.myPos,
                        damage: stats.damage
                    });
                    
                    if(type % 2 == 1){
                        audio.rocketLaunch();
                        collision.add(newBullet, creep, true);
                    }
                    else{
                        audio.bullet();
                        collision.add(newBullet, creep);
                    }

                    that.lastFire = 0;
                }
            } else {
                if (angle.crossProduct > 0) {
                    rot += rotateSpeed;
                } else {
                    rot -= rotateSpeed;
                }
            }
        }

        return true;
    }

    return that;
}

var TowerSystem = function () {
    var that = {};
    var towers = [];
    var placeTower = false;

    that.addTower = function ({
        type = TowerType.GROUND1,
        pos = {
            x,
            y
        },
    } = {}) {
        towers.push(tower({
            type,
            pos
        }));
        placeTower = false;
        m_map.setTower(pos);
        creepSystem.resetAllPaths();
        audio.buyTower();
    }

    that.render = function () {
        for (let i = 0; i < towers.length; i++) {
            towers[i].render();
        }
        if (placeTower !== false) {
            placeTower.render();
        }
    }

    that.update = function (elapsedTime) {
        for (let i = 0; i < towers.length; i++) {
            if(!towers[i].update(elapsedTime)) {
                towers.splice(i, 1);
                i--;
            }
        }
        if (vm.placeTower === "") {
            placeTower = false;
            return;
        }
        if (vm.mousePosition !== null) {
            var pos= {
                x: Math.floor(vm.mousePosition.x / 50),
                y: Math.floor(vm.mousePosition.y / 50)
            };
            var isValid = m_map.validPosition(pos) && vm.money > towerCosts[vm.placeTower]; 
            placeTower = tower({
                type: TowerType[vm.placeTower],
                pos,
                ghost: true,
                fill: isValid ? 'rgb(124,252,0, .1)' : 'rgb(255,0,0, .1)',
            });
        }
    }

    that.initialize = function() {
        towers = [];
        placeTower = false;
    }

    that.selectTower = function({x, y}) {
        var t = null;
        towers.forEach(function (tower) {
            if(x >= tower.pos.x && x < tower.pos.x + 100 && y >= tower.pos.y && y < tower.pos.y + 100) {
                t = tower; 
            }
        });
        return t;
    }

    return that;
}

var towerSystem = TowerSystem();

module.exports = {
    TowerSystem: towerSystem,
    TowerType,
    tower,
    towerCosts,
    towerDamage,
    baseStats
};
