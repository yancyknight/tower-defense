const graphics = require('../../framework/graphics');
// const map = require('./map');
// var m_map = map.map;
// const creepSystem = require('./creeps').creepSystem;

var BulletType = {
    BULLET: 0,
    ROCKET: 1,
    BOMB: 2,
};

var bullet = function ({
    type = BulletType.BULLET1,
    myPos = {
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
    var speed = .5;
    that.hit = false;
    var bulletWidth;
    var bulletHeight;
    var bulletImage;
    
    switch(type) {
        case BulletType.BULLET:
            bulletWidth = 10;
            bulletHeight = 10;
            bulletImage = graphics.Img("bullet.png");
            break;
        case BulletType.BOMB:
            bulletWidth = 10;
            bulletHeight = 10;
            bulletImage = graphics.Img("bomb.png");
            break;
        case BulletType.ROCKET:
            bulletWidth = 10;
            bulletHeight = 10;
            bulletImage = graphics.Img("rocket.png");
            break;
    }

    that.render = function () {
        graphics.drawCircle({x:myPos.x, y:myPos.y, radius: 10, fill: '#ff00ff'});
        //graphics.drawCircle({x:goal.x+16, y:goal.y+16, radius: 10, fill: '#ffff00'});
/*        graphics.drawImage({
            image: bulletImage,
            dx: myPos.x + bulletWidth/2,
            dy: myPos.y + bulletHeight/2,
            sx: bulletWidth,
            sy: type * bulletHeight,
            sWidth: bulletWidth,
            sHeight: bulletHeight,
            dWidth: bulletWidth,
            dHeight: bulletHeight,
            rotation: rot,
        });*/
    }

    that.update = function (elapsedTime) {
        var adjustedX = goal.x + 16;
        var adjustedY = goal.y + 16;
        var hyp = Math.sqrt(Math.pow(adjustedX-myPos.x, 2)+ Math.pow(adjustedY-myPos.y, 2));
        var hypTravel = speed*elapsedTime;
        if(hyp < hypTravel) {
            myPos.x = adjustedX;
            myPos.y = adjustedY;
        }
        else {
            var angle = Math.atan2(adjustedY - myPos.y,adjustedX - myPos.x);
            var newHyp = hyp - hypTravel;
            var newY = Math.sin(angle)*newHyp;
            var newX = Math.cos(angle)*newHyp;
            myPos.x = adjustedX - newX;
            myPos.y = adjustedY - newY;
        }
    }

    return that;
}

var bulletSystem = function () {
    var that = {};
    var bullets = [];

    that.addBullet = function ({
        type = BulletType.BULLET,
        myPos = {
            x,
            y
        },
        goal = {
            x,y
        }
    } = {}) {
        bullets.push(bullet({
            type,
            myPos,
            goal,
        }));
    }

    that.render = function () {
        for (let i = 0; i < bullets.length; i++) {
            bullets[i].render();
        }
    }

    that.update = function (elapsedTime) {
        for (let i = 0; i < bullets.length; i++) {
            if(bullets[i].hit) {
                bullets.splice(i, 1);
                i--;
            }
            else{
                bullets[i].update(elapsedTime);
            }
        }
    }

    return that;
}

var m_bulletSystem = bulletSystem();

module.exports = {
    bulletSystem: m_bulletSystem,
    BulletType,
    id: 'bullet'
};
