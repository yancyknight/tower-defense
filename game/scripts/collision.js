const { bulletSystem } = require('./bullets');
const { creepSystem } = require('./creeps');
const collision = require('../../framework/collision');

function bulletHit(bullet, creep) {
    creep.health -= bullet.damage;
    bullet.hit = true;
}

function explosiveHit(bullet, creep) {
    bullet.hit = true;
    creepSystem.explodeNearCreeps(bullet)
}

function add(bullet, creep, explosion) {
    collision.register({
        obj1: bullet, 
        obj2: creep,
        once: true,
        handler: explosion === true ? explosiveHit : bulletHit
    });
}

function initialize() {
    collision.unregisterAllHandlers();
}

module.exports = {
    add,
    initialize
}