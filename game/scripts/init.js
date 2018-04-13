import style from '../styles/game.css';
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'

// configure language
locale.use(lang)

Vue.use(ElementUI);

const gameplay = require('./gameplay');

var view = new Vue({
    el: '#game',
    data: {
        show: 'main-menu'
    },
    methods: {
        startGame() {
            gameplay.initialize();
            gameplay.run();
            this.show = 'game-play';
        }
    }
});

global.view = view;