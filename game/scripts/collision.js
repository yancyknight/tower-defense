const { bulletSystem } = require('./bullets');
const { creepSystem } = require('./creeps');
const collision = require('../../framework/collision');

function bulletHit(bullet, creep) {
    creep.health -= bullet.damage;
    bulletSystem.destroy(bullet);
}

function add(bullet) {
    creepSystem.foreach(function(creep) {
        collision.register({
            obj1: bullet, 
            obj2: creep,
            once: true,
            handler: bulletHit
        });
    })
}

module.exports = {
    add
}