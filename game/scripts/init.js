import style from '../styles/game.css';

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