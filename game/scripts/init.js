import style from '../styles/game.css';
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import lang from 'element-ui/lib/locale/lang/en';
import locale from 'element-ui/lib/locale';
import graphics from '../../framework/graphics';
import localStorage from '../../framework/LocalStorage';

// configure language
locale.use(lang);

Vue.use(ElementUI);

const gameplay = require('./gameplay');
const { myKeyboard } = require('./input');
const { EventKey, KeyEvent } = require('../../framework/input');
const { upgradeTower, sellTower, startLevel } = require('./utils');

var updateSetting = function(option) {
    localStorage.setSingleSetting(option, vm[option]);
}

var getSettingOr = function(option, defaultValue) {
    var setting = localStorage.getSettings(option);
    console.log(option, setting);
    if(setting === null) return defaultValue;
    return setting;
}

var vm = new Vue({
    el: '#game',
    data: {
        show: 'main-menu',
        showOptions: false,
        showGrid: getSettingOr("showGrid", false),
        showTowerCoverage: getSettingOr("showTowerCoverage", false),
        mute: getSettingOr('mute', false),
        upgradeTowerKey: getSettingOr('upgradeTowerKey', 'U'),
        sellTowerKey: getSettingOr('sellTowerKey', 'S'),
        startLevelKey: getSettingOr('startLevelKey', 'G'),
        command: '',
        changeKeysVisible: false,
        score: 0,
        money: 1000,
        placeTower: '',
        mousePosition: null
    },
    watch:{
        showGrid: function () {updateSetting("showGrid");},
        showTowerCoverage: function() {updateSetting("showTowerCoverage");},
        mute: function() {updateSetting("mute");},
        upgradeTowerKey: function() {updateSetting("upgradeTowerKey");},
        sellTowerKey: function() {updateSetting("sellTowerKey");},
        startLevelKey: function() {updateSetting("startLevelKey");},
    },
    methods: {
        startGame() {
            gameplay.initialize();
            gameplay.run();
            this.show = 'game-play';
            this.showOptions = false;
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
        }
    },
    mounted() {
        this.$refs.gameCanvas.addEventListener('mousemove', (evt) => {
            var rect = this.$refs.gameCanvas.getBoundingClientRect();
            this.mousePosition = {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top
            };
        });

        this.$refs.gameCanvas.addEventListener('mouseout', () => {
            this.mousePosition = null
        });
    }
});

global.vm = vm;