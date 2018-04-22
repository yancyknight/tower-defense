import style from '../styles/game.css';
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import lang from 'element-ui/lib/locale/lang/en';
import locale from 'element-ui/lib/locale';
import graphics from '../../framework/graphics';
import localStorage from '../../framework/LocalStorage';
import axios from 'axios';

// configure language
locale.use(lang);

Vue.use(ElementUI);

const gameplay = require('./gameplay');
const { myKeyboard } = require('./input');
const { EventKey, KeyEvent } = require('../../framework/input');
const { upgradeTower, sellTower } = require('./utils');
const { nextLevel } = require('./level');
const { baseStats, towerDamage, towerCosts, TowerType } = require('./towers');

var updateSetting = function(option) {
    localStorage.setSingleSetting(option, vm[option]);
}

var getSettingOr = function(option, defaultValue) {
    var setting = localStorage.getSettings(option);
    if(setting === null) return defaultValue;
    return setting;
}

var vm = new Vue({
    el: '#game',
    data: {
        show: 'main-menu',
        playLevel: false,
        showOptions: false,
        showGrid: getSettingOr("showGrid", false),
        showTowerCoverage: getSettingOr("showTowerCoverage", false),
        mute: getSettingOr('mute', false),
        upgradeTowerKey: getSettingOr('upgradeTowerKey', 'U'),
        sellTowerKey: getSettingOr('sellTowerKey', 'S'),
        startLevelKey: getSettingOr('startLevelKey', 'G'),
        command: '',
        changeKeysVisible: false,
        money: 1000,
        placeTower: '',
        mousePosition: null,
        highScores: [],
        lives: 10,
        highScoreInputVisible: false,
        name: '',
        selectedTower: null
    },
    watch:{
        showGrid() {updateSetting("showGrid");},
        showTowerCoverage() {updateSetting("showTowerCoverage");},
        mute() {updateSetting("mute");},
        upgradeTowerKey() {updateSetting("upgradeTowerKey");},
        sellTowerKey() {updateSetting("sellTowerKey");},
        startLevelKey() {updateSetting("startLevelKey");},
        lives() {
            if(this.lives < 1) {
                gameplay.pause();
                axios.get('/highscores').then(function(res) {
                    vm.highScores = res.data;
                    if(vm.highScores.length < 10 || vm.highScores[9].score < vm.money) {
                        vm.highScoreInputVisible = true;
                    } else {
                        vm.show = 'main-menu';
                    }
                });
            }
        }
    },
    computed: {
        placeTowerStats() {
            return {
                ...baseStats,
                damage: towerDamage[TowerType[this.placeTower]],
                cost: towerCosts[this.placeTower]
            }
        }
    },
    methods: {
        startGame() {
            gameplay.initialize();
            gameplay.run();
            this.show = 'game-play';
            this.showOptions = false;
            this.money = 1000;
            this.lives = 10;
            this.playLevel = false;
            this.selectedTower = null;
            this.command = '';
            this.placeTower = '';
            this.name = '';
            graphics.init();
        },
        selectUpgradeTower() {
            this.command = 'Upgrade Tower'
            this.changeKeysVisible = true;
            window.addEventListener('keydown', function(e) {
                if(vm.changeKeysVisible) {
                    myKeyboard.deregisterCommands(KeyEvent[`DOM_VK_${vm.upgradeTowerKey}`]);
                    myKeyboard.registerCommand(e.keyCode, upgradeTower, true);
                    vm.upgradeTowerKey = EventKey[e.keyCode];
                    vm.changeKeysVisible = false;
                }
            }, { once: true });
        },
        selectSellTower() {
            this.command = 'Sell Tower'
            this.changeKeysVisible = true;
            window.addEventListener('keydown', function(e) {
                if(vm.changeKeysVisible) {
                    myKeyboard.deregisterCommands(KeyEvent[`DOM_VK_${vm.sellTowerKey}`]);
                    myKeyboard.registerCommand(e.keyCode, sellTower, true);
                    vm.sellTowerKey = EventKey[e.keyCode];
                    vm.changeKeysVisible = false;
                }
            }, { once: true });
        },
        selectStartLevel() {
            this.command = 'Start Level'
            this.changeKeysVisible = true;
            window.addEventListener('keydown', function(e) {
                if(vm.changeKeysVisible) {
                    myKeyboard.deregisterCommands(KeyEvent[`DOM_VK_${vm.startLevelKey}`]);
                    myKeyboard.registerCommand(e.keyCode, startLevel, true);
                    vm.startLevelKey = EventKey[e.keyCode];
                    vm.changeKeysVisible = false;
                }
            }, { once: true });
        },
        selectTower(tower) {
            this.placeTower = tower;
            if(this.placeTower) this.selectedTower = null;
        },
        getHighScores() {
            axios.get('/highscores').then(function(res) {
                vm.highScores = res.data;
            });
        },
        submitHighScore() {
            axios.post('/highscores', {name: this.name, score: this.money})
                .then(function() {
                    vm.getHighScores();
                });
            vm.highScoreInputVisible = false;
            vm.show = 'high-scores';
        },
        nextLevel
    },
    mounted() {
        this.$refs.gameCanvas.addEventListener('mousemove', (evt) => {
            var rect = this.$refs.gameCanvas.getBoundingClientRect();
            this.mousePosition = {
                x: Math.floor((evt.clientX - rect.left)*5/4),
                y: Math.floor((evt.clientY - rect.top)*5/3)
            };
        });

        this.$refs.gameCanvas.addEventListener('mouseout', () => {
            this.mousePosition = null
        });

        this.$on('level-complete', function() {
            this.playLevel = false;
        });
    }
});

global.vm = vm;