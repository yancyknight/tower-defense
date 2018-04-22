const { creepSystem, CreepType } = require('./creeps');
var currLevel = 1;

var top = [{x: 8, y: 0}, {x: 9, y: 0}, {x: 10, y: 0}, {x: 11, y: 0}];
var bottom = [{x: 8,y: 19},{x: 9,y: 19},{x: 10,y: 19},{x: 11,y: 19}];
var left =  [{x: 0, y: 8}, {x: 0, y: 9}, {x: 0, y: 10}, {x: 0, y: 11}];
var right = [{x: 19, y: 8},{x: 19, y: 9},{x: 19, y: 10},{x: 19, y: 11}];

var creepFunctions = [];
function eyebawl(level, enter, exit) {
    return {
        time: 1000*level,
        amount: 5 * level,
        type: CreepType.EYEBALL,
        startingPositions: enter,
        endingPositions: exit
    }
}
creepFunctions.push(eyebawl);

function firewoof(level, enter, exit) {
    return {
        time: 20000*level,
        amount: 5 * level,
        type: CreepType.FIREWOOF,
        startingPositions: enter,
        endingPositions: exit
    }
}
creepFunctions.push(firewoof);

function jetster(level, enter, exit) {
    return {
        time: 30000 * level,
        amount: 5 * level,
        type: CreepType.JETSTER,
        startingPositions: enter,
        endingPositions: exit
    }
}
creepFunctions.push(jetster);

const nextLevel = function() {
    if(!vm.playLevel) {
        vm.playLevel = true;
        switch(currLevel) {
            case 1:
                creepSystem.addCreepSystem(eyebawl(currLevel, left, right));
                break;
            case 2:
                creepSystem.addCreepSystem(eyebawl(currLevel, top, bottom));
                setTimeout(function(){ 
                    creepSystem.addCreepSystem(firewoof(currLevel, left, right));
                }, 3000);
                break;
            case 3:
                creepSystem.addCreepSystem(eyebawl(currLevel, top, bottom));
                setTimeout(function(){ 
                    creepSystem.addCreepSystem(firewoof(currLevel, left, right));
                }, 3000);
                setTimeout(function(){ 
                    creepSystem.addCreepSystem(jetster(currLevel, left, right));
                }, 6000);
                setTimeout(function(){
                    creepSystem.addCreepSystem(jetster(currLevel, top, bottom));
                }, 12000);
                break;
            default:
                for(var i = 0; i < currLevel; i++){
                    var nextType = Math.floor(Math.random()*3);
                    setTimeout(function(){
                        switch(Math.floor(Math.random()*4)){
                            case 0:
                                creepSystem.addCreepSystem(creepFunctions[nextType](currLevel, left, right));
                            case 1:
                                creepSystem.addCreepSystem(creepFunctions[nextType](currLevel, right, left));
                            case 2:
                                creepSystem.addCreepSystem(creepFunctions[nextType](currLevel, top, bottom));
                            case 3:
                                creepSystem.addCreepSystem(creepFunctions[nextType](currLevel, bottom, top));
                        }
                    }, Math.floor(Math.random()*i)*1000);
                }
            break;
        }
        currLevel += 1;
    }
}

module.exports = {
    nextLevel
}