const graphics = require('../../framework/graphics');
const map = require('./map');
var m_map = map.map;
const creepSystem = require('./creeps').creepSystem;

var TowerType = {
    TOWER1: 0,
    TOWER2: 1,
    TOWER3: 2,
};

var towerImage = graphics.Img("shipsheetparts2-highercontrast.PNG");
var towerBaseImage = graphics.Img("tankBase.png");

//const creatureHeight = creaturesImage.height / amountOfCreatures;
//const creatureWidth = creaturesImage.width / 4;
const towerWidth = 100;
const towerHeight = 100;

var tower = function ({
    type = TowerType.TOWER1,
    pos = {
        x,
        y
    },
} = {}) {
    var that = {};
    let rot = 0;
    let rateOfFire = 100;
    let lastFire = 0;
    let range = 250;
    var myPos = {
    x: pos.x*1000/map.rowColSize,
    y: pos.y*1000/map.rowColSize}
    let pic = 0;
    let level = 0;

    that.render = function () {
        graphics.drawImage({
            image:towerBaseImage,
            dx: myPos.x,
            dy: myPos.y,
            dWidth: towerWidth,
            dHeight: towerHeight,
        });
        graphics.drawImage({
            image: towerImage,
            dx: myPos.x+20,
            dy: myPos.y+20,
            sx: pic * towerWidth+15,
            sy: level * 3 * towerHeight+10,
            sWidth: 50,
            sHeight: 40,
            dWidth: towerWidth-40,
            dHeight: towerHeight-40,
            rotation: rot,
        });
    }

    that.update = function (elapsedTime) {
        lastFire += elapsedTime;
        if(lastFire >= rateOfFire) {
            //find creep to fire at
            var creep = creepSystem.findNextCreep({x:myPos.x+towerWidth/2, y:myPos.y+towerWidth/2}, range);
            if(creep !== undefined) {
                rot = Math.atan2(creep.myPos.y+20-myPos.y-towerWidth/2, creep.myPos.x+15 - myPos.x-towerHeight/2)+Math.PI/2;
            }
            lastFire = 0 ;
        }
    }

    return that;
}

var towerSystem = function (map) {
    var that = {};
    var towers = [];

    that.addTower = function({
    type = TowerType.TOWER1,
    pos = {x, y},
    } = {}) {
        towers.push(tower({type, pos}));
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
