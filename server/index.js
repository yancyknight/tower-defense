const express = require('express');
const path = require('path');
const { getScores, addScore } = require('../framework/HighScores');
const bodyParser = require('body-parser');
const compression = require('compression');
const PORT = process.env.PORT || 3001;

const app = express();

app.use(compression());

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

app.listen(PORT, function() {
    console.log(`Listening on port ${PORT}`);
});
