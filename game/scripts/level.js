const { creepSystem, CreepType } = require('./creeps');
var currLevel = 1;

function eyebawl(level) {
    return {
        time: 1,
        amount: 5 * level,
        type: CreepType.EYEBALL,
        startingPositions: [
            {
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
<<<<<<< HEAD
            }],
            endingPositions: [{x: 19,y: 8},
                              {x: 19,y: 9},
                              {x: 19,y: 10},
                              {x: 19,y: 11}]
        });/*
        
        creepSystem.addCreepSystem({
            time: 20000,
            amount: 50,
            type: CreepType.FIREWOOF,
            startingPositions: [{
=======
            }
        ],
        endingPositions: [
            {x: 19, y: 8},
            {x: 19, y: 9},
            {x: 19, y: 10},
            {x: 19, y: 11}
        ]
    }
}

function firewoof(level) {
    return {
        time: 20000,
        amount: 5 * level,
        type: CreepType.FIREWOOF,
        startingPositions: [
            {
>>>>>>> origin/master
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
            }
        ],
        endingPositions: [
            {x: 8,y: 19},
            {x: 9,y: 19},
            {x: 10,y: 19},
            {x: 11,y: 19}
        ]
    }
}

function jetster(level) {
    return {
        time: 30000,
        amount: 5 * level,
        type: CreepType.JETSTER,
        startingPositions: [
            {
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
<<<<<<< HEAD
            }],
            endingPositions: [{x: 8,y: 19},
                              {x: 9,y: 19},
                              {x: 10,y: 19},
                              {x: 11,y: 19}]
        });*/
=======
            }
        ],
        endingPositions: [
            {x: 8,y: 19},
            {x: 9,y: 19},
            {x: 10,y: 19},
            {x: 11,y: 19}
        ]
    }
}

const nextLevel = function() {
    if(!vm.playLevel) {
        vm.playLevel = true;
        creepSystem.addCreepSystem(eyebawl(currLevel));
        
        creepSystem.addCreepSystem(firewoof(currLevel));
        
        creepSystem.addCreepSystem(jetster(currLevel));
        currLevel += 1;
>>>>>>> origin/master
    }
}

module.exports = {
    nextLevel
}