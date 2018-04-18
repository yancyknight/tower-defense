const { creepSystem, CreepType } = require('./creeps');

const startLevel = {
    one: function() {
        creepSystem.addCreepSystem({
            time: 10000,
            amount: 50,
            type: CreepType.EYEBALL,
            startingPositions: [{
                x: 0,
                y: 8
            }, {
                x: 0,
                y: 9
            }, {
                x: 0,
                y: 10
            }, {
                x: 0,
                y: 11
            }],
            endingPositions: [{x: 19,y: 8},
                              {x: 19,y: 9},
                              {x: 19,y: 10},
                              {x: 19,y: 11}]
        });
        
        creepSystem.addCreepSystem({
            time: 20000,
            amount: 50,
            type: CreepType.FIREWOOF,
            startingPositions: [{
                x: 8,
                y: 0
            }, {
                x: 9,
                y: 0
            }, {
                x: 10,
                y: 0
            }, {
                x: 11,
                y: 0
            }],
            endingPositions: [{x: 8,y: 19},
                              {x: 9,y: 19},
                              {x: 10,y: 19},
                              {x: 11,y: 19}]
        });
        
        creepSystem.addCreepSystem({
            time: 30000,
            amount: 70,
            type: CreepType.JETSTER,
            startingPositions: [{
                x: 8,
                y: 0
            }, {
                x: 9,
                y: 0
            }, {
                x: 10,
                y: 0
            }, {
                x: 11,
                y: 0
            }],
            endingPositions: [{x: 8,y: 19},
                              {x: 9,y: 19},
                              {x: 10,y: 19},
                              {x: 11,y: 19}]
        });
    }
}

module.exports = {
    startLevel
}