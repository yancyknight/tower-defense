const graphics = require('./graphics');

function GameObject({
    position: {
        x = 0,
        y = 0
    } = {},
    size: {
        w = 0,
        h = 0,
        radius = 0
    } = {},
} = {}) {
    let that = {
        behaviors: {
            position: { x, y },
            size: { w, h, radius }
        }
    };
    let updateList = [];
    let renderList = [];

    that.getUpdateList = function() {
        return updateList;
    }

    that.getRenderList = function() {
        return renderList;
    }

    that.addBehavior = function(data) {
        if(typeof data !== 'object') throw 'GameObject.addBehavior: data is required and must be an object'
        if(typeof data.name !== 'string') throw 'GameObject.addBehavior: data.name is required and must be a string'

        var name = data.name;
        delete data.name;

        if(typeof data.update === 'function') {
            updateList.push({name, update: data.update});
            delete data.update;
        }
        if(typeof data.render === 'function') {
            renderList.push({name, render: data.render});
            delete data.render;
        }

        that.behaviors[name] = data;
    }

    that.update = function(elapsedTime) {
        if(typeof elapsedTime === 'undefined') throw 'GameObject.update: elapsedTime is required'
        for(let i = 0; i < updateList.length; i++) {
            updateList[i].update(elapsedTime, that);
        }
    }

    that.render = function() {
        for(let i = 0; i < renderList.length; i++) {
            renderList[i].render(that);
        }
    }

	return that;
}

let behaviors = {
    Collision() {
        return {
            name: 'collision',
            getBoundingBox({
                behaviors,
                behaviors: {
                    position: { x, y } = {},
                    size: { w, h } = {}
                } = {}
            } = {}) {
                if(typeof behaviors === 'undefined') throw 'behaviors.Collision.getBoundingBox: must pass a reference to the object'
                // if (typeof object.radius === 'number') {
                //     // assume we have a circle
                //     return {
                //         height: object.radius * 2,
                //         width: object.radius * 2,
                //         x: object.x - object.radius,
                //         y: object.y - object.radius
            
                //     }
                // } else {
                return { x, y, w, h }
                // }
            }
        }
    },
    Speed({
        /*
            angle is only used if a velocity is passed as well
            if x and y are passed alone, they will be used as a velocity vector
            if x and y and a velocity is passed, x and y will be transformed into a unit vector
        */
        x = 0,
        y = 0,
        name = 'speed',
        angle,
        velocity
    } = {}) {
        if(typeof x !== 'number') throw 'Speed: x must be a number';
        if(typeof y !== 'number') throw 'Speed: y must be a number';
        return {
            name,
            x,
            y,
            angle,
            velocity,
            update(elapsedTime, obj) {
                if(typeof elapsedTime === 'undefined') throw 'Speed.update needs an elapsed time';
                var b = obj.behaviors;
        
                if(typeof b[name].angle === 'number' && typeof b[name].velocity === 'number') {
                    b.position.x += Math.cos(b[name].angle) * b[name].velocity * elapsedTime;
                    b.position.y += Math.sin(b[name].angle) * b[name].velocity * elapsedTime;
                } else if (typeof b[name].velocity === 'number') {;
                    let mag = Math.sqrt(b[name].x * b[name].x + b[name].y * b[name].y);
                    let ux = b[name].x / mag;
                    let uy = b[name].y / mag;
                    b.position.x += ux * b[name].velocity * elapsedTime;
                    b.position.y += uy * b[name].velocity * elapsedTime;
                } else {
                    b.position.x += b[name].x * elapsedTime;
                    b.position.y += b[name].y * elapsedTime;
                }
            }
        };
    }
}

// let Rectangle = function({
//     position: {
//         x: px,
//         y: py
//     } = {},
//     size: {
//         w,
//         h
//     } = {},
//     speed: {
//         x: sx = 0,
//         y: sy = 0,
//         angle,
//         velocity
//     } = {},
//     color: {
//         fill = '#000000',
//         stroke = '#000000'
//     } = {},
// } = {}) {
//     let that = GameObject({
//         position: {
//             x: px,
//             y: py
//         },
//         size: {
//             w,
//             h
//         },
//         speed: {
//             x: sx,
//             y: sy,
//             angle,
//             velocity
//         },
//         color: {
//             fill,
//             stroke
//         },
//     });

//     that.render = function() {
//         let { x, y } = that.getPosition();
//         let { w, h } = that.getSize();
//         graphics.drawRectangle({x, y, w, h, stroke, fill});
//     };

//     that.getColor = function() {
//         return {
//             fill,
//             stroke
//         }
//     }

//     return that;
// }

module.exports = {
    GameObject,
    behaviors
}
