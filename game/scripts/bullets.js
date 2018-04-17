const graphics = require('../../framework/graphics');
// const map = require('./map');
// var m_map = map.map;
// const creepSystem = require('./creeps').creepSystem;

var BulletType = {
    BULLET1: 0,
    BULLET2: 1,
    BULLET3: 2,
};

var bulletImage = graphics.Img("M484BulletCollection1.png");

const bulletWidth = 10;
const bulletHeight = 10;

var bullet = function ({
    type = BulletType.BULLET1,
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
    let pic = 0;

    that.render = function () {
        graphics.drawImage({
            image: bulletImage,
            dx: pos.x + bulletWidth/2,
            dy: pos.y + bulletHeight/2,
            sx: bulletWidth,
            sy: type * bulletHeight,
            sWidth: bulletWidth,
            sHeight: bulletHeight,
            dWidth: bulletWidth,
            dHeight: bulletHeight,
            rotation: rot,
        });
    }

    that.update = function (elapsedTime) {
        
        if (lastFire >= rateOfFire) {
            //find creep to fire at
            var creep = creepSystem.findNextCreep({
                x: myPos.x + towerWidth / 2,
                y: myPos.y + towerWidth / 2
            }, range);
            if (creep !== undefined) {
                rot = Math.atan2(creep.myPos.y + 20 - myPos.y - towerWidth / 2, creep.myPos.x + 15 - myPos.x - towerHeight / 2) + Math.PI / 2;
            }
            lastFire = 0;
        }
    }

    return that;
}

var towerSystem = function (map) {
    var that = {};
    var towers = [];

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
        map.setTower(pos);
    }

    that.render = function () {
        for (let i = 0; i < towers.length; i++) {
            towers[i].render();
        }
    }

    that.update = function (elapsedTime) {
        for (let i = 0; i < towers.length; i++) {
            towers[i].update(elapsedTime);
        }
    }

    return that;
}

module.exports = {
    towerSystem,
    TowerType,
    id: 'tower'
};
