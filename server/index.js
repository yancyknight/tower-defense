const express = require('express');
const path = require('path');
const { getScores, addScore } = require('../framework/HighScores');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(path.join(__dirname, 'images')));

app.use(express.static(path.join(__dirname, 'audio')));

app.get('/', function(req, res) {
    res.sendFile(path.resolve(__dirname, '../game/index.html'));
});

app.get('/highscores', function(req, res) {
    getScores().then(function(val) {
        res.json(val);
    })
});

app.post('/highscores', function(req, res) {
    addScore(req.body).then(function() {
        getScores().then(function(val) {
            res.json(val);
        })
    });
});

app.listen(3001, function() {
    console.log(`Listening on port 3001`);
});
