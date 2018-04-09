let graphics = require('./graphics');

let collision = {};
let registeredHandlers = [];

collision.register = function ({
    obj1,
    obj2,
    handler,
    once = false
} = {}) {
    if(typeof obj1 !== 'object') throw 'collision.register: obj1 is required and must be an object'
    if(typeof obj2 !== 'object') throw 'collision.register: obj2 is required and must be an object'
    if(typeof handler !== 'function') throw 'collision.register: handler is required and must be a function'
    if(typeof obj1.behaviors !== 'object' || typeof obj2.behaviors !== 'object') throw 'objects must have behaviors'
    if(typeof obj1.behaviors.collision !== 'object' || typeof obj2.behaviors.collision !== 'object') throw 'objects must have a collision behavior'
    if(typeof obj1.behaviors.collision.getBoundingBox !== 'function' || typeof obj2.behaviors.collision.getBoundingBox !== 'function') throw 'object collision behavior must have a getBoundingBox function'

    registeredHandlers.push({
        obj1,
        obj2,
        handler,
        once,
        colliding: false
    });
}

collision.unregisterAllHandlers = function () {
    registeredHandlers.length = 0;
}

collision.drawBoundingBox = function () {
    for (let i = 0; i < registeredHandlers.length; i++) {
        let handler = registeredHandlers[i];

        let bb1 = handler.obj1.behaviors.collision.getBoundingBox(handler.obj1);
        bb1.fill = 'rgba(0,0,0,0)';
        bb1.stroke = 'rgb(255,0,0)';
        graphics.drawRectangle(bb1);

        let bb2 = handler.obj2.behaviors.collision.getBoundingBox(handler.obj2);
        bb2.fill = 'rgba(0,0,0,0)';
        bb2.stroke = 'rgb(255,0,0)';
        graphics.drawRectangle(bb2);
    }
}

collision.update = function() {
    for (let i = 0; i < registeredHandlers.length; i++) {
        let handler = registeredHandlers[i];
        let bb1 = handler.obj1.behaviors.collision.getBoundingBox(handler.obj1);
        let bb2 = handler.obj2.behaviors.collision.getBoundingBox(handler.obj2);
        let l1 = { x: bb1.x, y: bb1.y };
        let r1 = { x: bb1.x + bb1.w, y: bb1.y + bb1.h };
        let l2 = { x: bb2.x, y: bb2.y };
        let r2 = { x: bb2.x + bb2.w, y: bb2.y + bb2.h };

        if (l1.x > r2.x || l2.x > r1.x) {
            handler.colliding = false;
            continue;
        }

        if (l1.y > r2.y || l2.y > r1.y) {
            handler.colliding = false;
            continue;
        }

        if(handler.colliding) {
            continue;
        }

        handler.colliding = true;
        handler.handler(handler.obj1, handler.obj2);
        if (handler.once === true) {
            registeredHandlers.splice(i, 1);
            i--;
        }
    }
}

module.exports = collision;