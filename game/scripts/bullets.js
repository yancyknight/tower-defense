const graphics = require('../../framework/graphics');
const { creepSystem } = require('./creeps');
const particleSystem = require('../../framework/ParticleSystem').ParticleSystemManager();

var BulletType = {
    BULLET: 0,
    ROCKET: 1,
    BOMB: 2,
};

var bulletImages = [graphics.Img("bullet.png"), graphics.Img("rocket.png"), graphics.Img("bomb.png")];

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
    that.rot = 0;
    let pic = 0;
    var speed = .1;
    that.hit = false;
    var bulletWidth;
    var bulletHeight;
    var bulletImage = bulletImages[type];
    var rocketEnd = {x:myPos.x, y:myPos.y};
    that.myPos = myPos;
    
    switch(type) {
        case BulletType.BULLET:
            bulletWidth = 10;
            bulletHeight = 10;
            that.damage = 70;
            break;
        case BulletType.BOMB:
            bulletWidth = 40;
            bulletHeight = 40;
            that.damage = 85;
            particleSystem.addParticleSystem(rocketEnd, {
                speedmean: .1, speedstdev: 0.04,
                lifetimemean: 300,lifetimestdev: 50,
                sizemean: 5, sizestdev: 0,
                fill: 'rgba(0, 255, 255, 0.75)',
                stroke: 'rgba(0, 255, 0, 0.5)',
                image: 'smoke.png',
                rate: 1, // If rate is undefined, it will use amount
                amount: 100,
                style: 'image',
                angleOffset: Math.PI*7/8,
                angleTotal: Math.PI/4,
                imagedHeight: 20,
                imagedWidth: 20,
                parent: that, dieOnParent: true
            });
            that.explodeRange = 80;
            break;
        case BulletType.ROCKET:
            bulletWidth = 10;
            bulletHeight = 10;
            that.damage = 90;
            break;
    }

    that.getBoundingBox = function() {
        return {
            x: myPos.x - bulletWidth/2,
            y: myPos.y - bulletHeight/2,
            w: bulletWidth, 
            h: bulletHeight
        }
    }

    that.render = function () {
        graphics.drawImage({
            image: bulletImages[type],
            dx: myPos.x - bulletWidth/2,
            dy: myPos.y - bulletHeight/2,
            sx: 0,
            sy: 0,
            sWidth: bulletWidth,
            sHeight: bulletHeight,
            dWidth: bulletWidth,
            dHeight: bulletHeight,
            rotation: that.rot,
        });
        
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
            var angle = Math.atan2(adjustedY - myPos.y, adjustedX - myPos.x);
            that.rot = angle + Math.PI/2;
            var newHyp = hyp - hypTravel;
            var newY = Math.sin(angle)*newHyp;
            var newX = Math.cos(angle)*newHyp;
            myPos.x = adjustedX - newX;
            myPos.y = adjustedY - newY;
            if(type !== BulletType.BULLET) {
                rocketEnd.x = myPos.x - Math.cos(angle) * bulletWidth/2
                rocketEnd.y = myPos.y - Math.sin(angle) * bulletHeight/2;
            }
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
        var newBullet = bullet({
            type,
            myPos,
            goal,
        });

        bullets.push(newBullet);

        return newBullet;
    }

    that.render = function () {
        for (let i = 0; i < bullets.length; i++) {
            bullets[i].render();
        }
        particleSystem.render();
    }

    that.update = function (elapsedTime) {
        for (let i = 0; i < bullets.length; i++) {
            if(bullets[i].hit) {
                particleSystem.addParticleSystem(bullets[i].myPos, {
                    speedmean: .1, speedstdev: 0.04,
                    lifetimemean: 300,lifetimestdev: 50,
                    sizemean: 5, sizestdev: 0,
                    fill: 'rgba(0, 255, 255, 0.75)',
                    stroke: 'rgba(0, 255, 0, 0.5)',
                    image: 'fire.png',
                    amount: 100,
                    style: 'image',
                    imagedHeight: 20,
                    imagedWidth: 20,
                });
                bullets.splice(i, 1);
                i--;
            }
            else{
                bullets[i].update(elapsedTime);
            }
        }
        particleSystem.update(elapsedTime);
    }

    return that;
}

var m_bulletSystem = bulletSystem();

module.exports = {
    bulletSystem: m_bulletSystem,
    BulletType
};
