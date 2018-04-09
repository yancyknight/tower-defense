const express = require('express');

const app = express();

app.use(express.static('public'));

app.get('*', function(req, res) {
    res.sendFile(path.resolve(__dirname, '../game/index.html'));
});

app.listen(3000, function() {
    console.log(`Listening on port 3000`);
});