import style from '../styles/game.css';
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import lang from 'element-ui/lib/locale/lang/en';
import locale from 'element-ui/lib/locale';
import graphics from '../../framework/graphics';

// configure language
locale.use(lang);

Vue.use(ElementUI);

const gameplay = require('./gameplay');

var view = new Vue({
    el: '#game',
    data: {
        show: 'main-menu',
        showOptions: false,
        showGrid: false,
        showTowerCoverage: false,
        // showEnemyPath: false,
        mute: false,
        upgradeTowerKey: 'U',
        sellTowerKey: 'S',
        startLevelKey: 'G'
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

        },
        selectSellTower() {
            
        },
        selectStartLevel() {
            
        }
    },
    mounted() {

    }
});

global.view = view;