'use strict';
const graphics = require('./graphics');
var systems = [];

function nextCircleVector(angleOffset, angleTotal) {
    var angle = ((Math.random() * 2 * Math.PI) % angleTotal) + angleOffset;
    return {
        x: Math.cos(angle),
        y: Math.sin(angle)
    };
}

var usePrevious = false,
    y2;

function nextGaussian(mean, stdDev) {
    if (usePrevious) {
        usePrevious = false;
        return mean + y2 * stdDev;
    }

    usePrevious = true;

    var x1 = 0,
        x2 = 0,
        y1 = 0,
        z = 0;

    do {
        x1 = 2 * Math.random() - 1;
        x2 = 2 * Math.random() - 1;
        z = (x1 * x1) + (x2 * x2);
    } while (z >= 1);

    z = Math.sqrt((-2 * Math.log(z)) / z);
    y1 = x1 * z;
    y2 = x2 * z;

    return mean + y1 * stdDev;
}

function ParticleSystem(center, {
    speedmean,
    speedstdev,
    lifetimemean,
    lifetimestdev,
    sizemean,
    sizestdev,
    fill = 'rgba(0, 0, 255, 0.5)',
    style,
    stroke,
    image,
    imagedWidth,
    imagedHeight,
    rate,
    amount,
    angleOffset = 0,
    angleTotal = 2 * Math.PI
} = {}) {
    let that = {};
    let particles = [];
    let toAdd;
    if(rate === undefined) {
        toAdd = amount;
    } else {
        toAdd = rate;
    }
    if (style === 'image') {
        var iImage = graphics.Img(image);
    }
    that.render = function () {
        for (let particle = 0; particle < particles.length; particle++) {
            if (particles[particle].alive >= 100) {
                if (particles[particle].style === 'circle') {
                    graphics.drawCircle({
                        x: particles[particle].particleCenter.x,
                        y: particles[particle].particleCenter.y,
                        radius: particles[particle].size,
                        fill: particles[particle].fill,
                        stroke: particles[particle].stroke
                    });
                } else if (style == 'image') {
                    graphics.drawImage({
                        image: iImage,
                        dx: particles[particle].particleCenter.x,
                        dy: particles[particle].particleCenter.y,
                        dWidth: imagedWidth,
                        dHeight: imagedHeight
                    })
                }
            }
        }
    };

    that.update = function (elapsedTime) {
        let keepMe = [];

        for (let particle = 0; particle < particles.length; particle++) {
            particles[particle].alive += elapsedTime;
            particles[particle].particleCenter.x += (elapsedTime * particles[particle].speed * particles[particle].direction.x);
            particles[particle].particleCenter.y += (elapsedTime * particles[particle].speed * particles[particle].direction.y);
            particles[particle].rotation += particles[particle].speed / .5;

            if (particles[particle].alive <= particles[particle].lifetime) {
                keepMe.push(particles[particle]);
            }
        }

        for (let particle = 0; particle < toAdd; particle++) {
            let p = {
                particleCenter: {
                    x: center.x,
                    y: center.y
                },
                direction: nextCircleVector(angleOffset, angleTotal),
                speed: Math.abs(nextGaussian(speedmean, speedstdev)), // pixels per millisecond
                rotation: 0,
                lifetime: nextGaussian(lifetimemean, lifetimestdev), // milliseconds
                alive: 0,
                size: nextGaussian(sizemean, sizestdev),
                fill: fill,
                stroke: stroke,
                style: style
            };
            keepMe.push(p);
            if(rate === undefined) {
                toAdd--;
            }
        }
        particles = keepMe;
        if(particles.length === 0) {
            return false;
        }
    };

    return that;
}

function ParticleSystemManager() {
    let that = {};
    that.addParticleSystem = function (center, {
    speedmean,
    speedstdev,
    lifetimemean,
    lifetimestdev,
    sizemean,
    sizestdev,
    fill = 'rgba(0, 0, 255, 0.5)',
    style,
    stroke,
    image,
    imagedWidth,
    imagedHeight,
    rate,
    amount,
    angleOffset = 0,
    angleTotal = 2 * Math.PI
} = {}) {
        var system = ParticleSystem(center, {
            speedmean,
            speedstdev,
            lifetimemean,
            lifetimestdev,
            sizemean,
            sizestdev,
            fill,
            style,
            stroke,
            image,
            imagedWidth,
            imagedHeight,
            rate,
            amount,
            angleOffset,
            angleTotal});
        systems.push(system);
    }

    that.update = function(elapsedTime) {
        var toDelete = [];
        for(let i = 0; i < systems.length; i++) {
            if(systems[i].update(elapsedTime) === false) {
                toDelete.push(i);
            }
        }
        for(let i = toDelete.length-1; i >= 0; i--) {
            systems.splice(toDelete[i],1);
        }
    }

    that.render = function() {
        for(let i = 0; i < systems.length; i++) {
            systems[i].render();
        }
    }

    return that;

}

module.exports = {
    ParticleSystemManager,
};
