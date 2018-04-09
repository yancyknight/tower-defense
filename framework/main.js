const graphics = require('./graphics');
const object = require('./object');
const collision = require('./collision');
const LocalStorage = require('./LocalStorage');
const particles = require('./ParticleSystem')

fw = {
    graphics,
    object,
    collision,
    LocalStorage,
    particles,
};

global.fw = fw;
module.exports = fw;
