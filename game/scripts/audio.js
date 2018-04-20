const dieSound = new Audio('die.wav');
const hitSound = new Audio('hit.wav');
const buyTowerSound = new Audio('buyTower.wav');
const sellTowerSound = new Audio('sellTower.wav');
const explosionSound = new Audio('explosion.wav');
const rocketLaunchSound = new Audio('rocketlaunch.wav');
const bulletSound = new Audio('bullet.ogg');

function playSound(sound) {
    if(!vm.mute) {
        sound.play();
    }
}

function die() {
    playSound(dieSound)
}

function hit() {
    playSound(hitSound)
}

function sellTower() {
    playSound(sellTowerSound)
}

function buyTower() {
    playSound(buyTowerSound)
}

function explosion() {
    playSound(explosionSound)
}

function rocketLaunch() {
    playSound(rocketLaunchSound)
}

function bullet() {
    playSound(bulletSound)
}

module.exports = {
    die,
    hit,
    buyTower,
    sellTower,
    explosion,
    rocketLaunch,
    bullet
}