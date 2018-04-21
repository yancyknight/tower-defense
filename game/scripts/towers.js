const graphics = require('../../framework/graphics');
const map = require('./map');
var m_map = map.map;
const creepSystem = require('./creeps').creepSystem;
const bulletSystem = require('./bullets');
var m_bulletSystem = bulletSystem.bulletSystem;
const collision = require('./collision');

var TowerType = {
    TOWER11: 0,
    TOWER12: 1,
    TOWER13: 2,
    TOWER21: 3,
    TOWER22: 4,
    TOWER23: 5,
    TOWER31: 6,
    TOWER32: 7,
    TOWER33: 8,
    //    TOWER41: 9,
    //    TOWER42: 10,
    //    TOWER43: 11,
};

var towerCosts = {
    TOWER11: 50,
    TOWER21: 100,
    TOWER31: 50,
    TOWER41: 100,
}

var towerBaseImage = graphics.Img("tankBase.png");

let towerImages = [];
for (let i = 0; i < Object.keys(TowerType).length; i++) {
    towerImages.push(graphics.Img(`tower${ Math.ceil((i + 1) / 3) }-${ (i % 3) + 1 }.PNG`));
}
const baseSize = 100;

var tower = function ({
    type = TowerType.TOWER1,
    pos = {
        x,
        y
    },
    ghost = false,
    fill = 'rgba(128, 223, 255, .1)'
} = {}) {
    var that = {};
    let rot = 0;
    let rateOfFire = 500;
    let lastFire = 0;
    let range = 250;

    var myPos = {
        x: pos.x * 1000 / map.rowColSize,
        y: pos.y * 1000 / map.rowColSize
    }

    let pic = 0;
    let level = 0;
    var rotateSpeed = 12 * 3.14159 / 1000;
    var imageSize;
    var towerImage = towerImages[type];
    switch (type) {
        case TowerType.TOWER11:
            var towerWidth = 80;
            var towerHeight = 80;
            imageSize = 40;
            break;
        case TowerType.TOWER12:
            var towerWidth = 90;
            var towerHeight = 90;
            imageSize = 45;
            break;
        case TowerType.TOWER13:
            var towerWidth = 100;
            var towerHeight = 100;
            imageSize = 65;
            break;
        case TowerType.TOWER21:
            var towerWidth = 80;
            var towerHeight = 80;
            imageSize = 50;
            break;
        case TowerType.TOWER22:
            var towerWidth = 90;
            var towerHeight = 90;
            imageSize = 45;
            break;
        case TowerType.TOWER23:
            var towerWidth = 100;
            var towerHeight = 100;
            imageSize = 55;
            break;
        case TowerType.TOWER31:
            var towerWidth = 80;
            var towerHeight = 80;
            imageSize = 40;
            break;
        case TowerType.TOWER32:
            var towerWidth = 90;
            var towerHeight = 90;
            imageSize = 45;
            break;
        case TowerType.TOWER33:
            var towerWidth = 100;
            var towerHeight = 100;
            imageSize = 50;
            break;
    }

    var towerCenter = {
        x: myPos.x + 50,
        y: myPos.y + 50
    };

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
                radius: range,
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

        //
        // Get the cross product of the two vectors so we can know
        // which direction to rotate.
        cp = crossProduct2d(v1, v2);

        return {
            angle: angle,
            crossProduct: cp
        };
    }


    that.update = function (elapsedTime) {
        lastFire += elapsedTime;
        //find creep to fire at
        var creep = creepSystem.findNextCreep({
            x: towerCenter.x,
            y: towerCenter.y
        }, range);
        if (creep !== undefined) {
            // console.log('creep loc: ' +creep.myPos.x + " " + creep.myPos.y);
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
                if (lastFire > rateOfFire && !ghost) {
                    //fire!
                    var newBullet = m_bulletSystem.addBullet({
                        type:bulletSystem.BulletType.BULLET, 
                        myPos:{x: towerCenter.x, y: towerCenter.y}, 
                        goal:creep.myPos
                    });
                    collision.add(newBullet, creep);

                    lastFire = 0;
                }
            } else {
                if (angle.crossProduct > 0) {
                    rot += rotateSpeed;
                } else {
                    rot -= rotateSpeed;
                }
            }
        }
    }

    return that;
}

var TowerSystem = function () {
    var that = {};
    var towers = [];
    var placeTower = false;

    that.addTower = function ({
        type = TowerType.TOWER1,
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
            towers[i].update(elapsedTime);
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

    return that;
}

var towerSystem = TowerSystem();

module.exports = {
    TowerSystem: towerSystem,
    TowerType,
    tower,
    towerCosts,
};
