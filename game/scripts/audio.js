const dieSound = new Audio('die.wav');
const hitSound = new Audio('hit.wav');
const buyTowerSound = new Audio('buyTower.wav');
const sellTowerSound = new Audio('sellTower.wav');
const explosionSound = new Audio('explosion.wav');
const rocketLaunchSound = new Audio('rocketlaunch.wav');
const bulletSound = new Audio('bullet.ogg');

function die() {
    dieSound.play();
}

function hit() {
    hitSound.play();
}

function sellTower() {
    sellTowerSound.play();
}

function buyTower() {
    buyTowerSound.play();
}

function explosion() {
    explosionSound.play();
}

function rocketLaunch() {
    rocketLaunchSound.play();
}

function bullet() {
    bulletSound.play();
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