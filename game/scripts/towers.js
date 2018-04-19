const graphics = require('../../framework/graphics');
const map = require('./map');
var m_map = map.map;
const creepSystem = require('./creeps').creepSystem;
const bulletSystem = require('./bullets');
var m_bulletSystem = bulletSystem.bulletSystem;

var TowerType = {
    TOWER11: 0,
    TOWER12: 1,
    TOWER13: 2,
    TOWER21: 3,
    TOWER22: 4,
    TOWER23: 5,
    TOWER31: 6,
    TOWER32: 7,
    TOWER33: 8
};

var towerBaseImage = graphics.Img("tankBase.png");
const baseSize = 100;

var tower = function ({
    type = TowerType.TOWER1,
    pos = {
        x,
        y
    },
} = {}) {
    var that = {};
    let rot = 0;
    let rateOfFire = 500;
    let lastFire = 0;
    let range = 250;
    var myPos = {
        x: pos.x*1000/map.rowColSize,
        y: pos.y*1000/map.rowColSize}
    let pic = 0;
    let level = 0;
    var rotateSpeed = 12 * 3.14159 / 1000;
    var imageSize;

    switch(type) {
        case TowerType.TOWER11:
            var towerImage = graphics.Img("tower1-1.PNG");
            var towerWidth = 80;
            var towerHeight = 80;
            imageSize = 40;
            break;
        case TowerType.TOWER12:
            var towerImage = graphics.Img("tower1-2.PNG");
            var towerWidth = 90;
            var towerHeight = 90;
            imageSize = 45;
            break;
        case TowerType.TOWER13:
            var towerImage = graphics.Img("tower1-3.PNG");
            var towerWidth = 100;
            var towerHeight = 100;
            imageSize = 65;
            break;
        case TowerType.TOWER21:
            var towerImage = graphics.Img("tower2-1.PNG");
            var towerWidth = 80;
            var towerHeight = 80;
            imageSize = 50;
            break;
        case TowerType.TOWER22:
            var towerImage = graphics.Img("tower2-2.PNG");
            var towerWidth = 90;
            var towerHeight = 90;
            imageSize = 45;
            break;
        case TowerType.TOWER23:
            var towerImage = graphics.Img("tower2-3.PNG");
            var towerWidth = 100;
            var towerHeight = 100;
            imageSize = 55;
            break;
        case TowerType.TOWER31:
            var towerImage = graphics.Img("tower3-1.PNG");
            var towerWidth = 80;
            var towerHeight = 80;
            imageSize = 40;
            break;
        case TowerType.TOWER32:
            var towerImage = graphics.Img("tower3-2.PNG");
            var towerWidth = 90;
            var towerHeight = 90;
            imageSize = 45;
            break;
        case TowerType.TOWER33:
            var towerImage = graphics.Img("tower3-3.PNG");
            var towerWidth = 100;
            var towerHeight = 100;
            imageSize = 50;
            break;
        
    }

    var towerCenter = {x: myPos.x + 50, y: myPos.y + 50};
        
    that.render = function () {
        graphics.drawImage({
            image:towerBaseImage,
            dx: myPos.x,
            dy: myPos.y,
            dWidth: baseSize,
            dHeight: baseSize,
        });
        graphics.drawImage({
            image: towerImage,
            dx: myPos.x + (100 - towerWidth)/2,
            dy: myPos.y + (100 - towerHeight)/2,
            sx: 0,
            sy: 0,
            sWidth: imageSize,
            sHeight: imageSize,
            dWidth: towerWidth,
            dHeight: towerHeight,
            rotation: rot + Math.PI/2,
        });
        if(vm.showTowerCoverage) {
            graphics.drawCircle({
                x: towerCenter.x,
                y: towerCenter.y,
                radius: range,
                fill: 'rgba(128, 223, 255, .2)',
            });
        }
    }

    function crossProduct2d(v1, v2) {
		return (v1.x * v2.y) - (v1.y * v2.x);
	}

    function computeAngle(rotation, ptCenter, ptTarget) {
		var v1 = {
				x : Math.cos(rotation),
				y : Math.sin(rotation)
			},
			v2 = {
				x : ptTarget.x - ptCenter.x,
				y : ptTarget.y - ptCenter.y
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
			angle : angle,
			crossProduct : cp
		};
	}


    that.update = function (elapsedTime) {
        lastFire += elapsedTime;
        //find creep to fire at
        var creep = creepSystem.findNextCreep({x:towerCenter.x, y:towerCenter.y}, range);
        if(creep !== undefined) {
            // console.log('creep loc: ' +creep.myPos.x + " " + creep.myPos.y);
            var angle = computeAngle(rot, {x:towerCenter.x, y:towerCenter.y}, {x:creep.myPos.x+16, y:creep.myPos.y+16});
            if(angle.angle < .1) {
                if(angle.crossProduct > 0) {
                    rot += angle.angle;
                }
                else {
                    rot -= angle.angle;
                }
                if(lastFire > rateOfFire) {
                    //fire!
                    m_bulletSystem.addBullet({type:bulletSystem.BulletType.BULLET, 
                        myPos:{x: towerCenter.x, y: towerCenter.y}, 
                        goal:creep.myPos});
                    //register collision
                    lastFire = 0;
                }
            }
            else {
                if(angle.crossProduct > 0) {
                    rot += rotateSpeed;
                }
                else {
                    rot -= rotateSpeed;
                }
            }
        }
    }

    return that;
}

var TowerSystem = function (map) {
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
    TowerSystem,
    TowerType,
    id: 'tower'
};
