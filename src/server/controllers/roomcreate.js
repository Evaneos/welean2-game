var token2app = require('../token.js');
var generator = require('springbokjs-utils/generator');

module.exports = function(req, res) {
    // res.render('smartphone', { myData : "myValue" });

    var gameKey = req.params.gameKey;
    console.log(gameKey);

    if (gameKey != 'TheWar') {
        return res.json(500, { error : 'only TheWar allowed'});
    }

    var token, i = 0;

    while (!token || (token && token2app[token])) {
        token = generator.randomCode(7);
        if (i++ > 20) {
            return res.json(500, { error: 'Failed to generate token' });
        }
    }

    console.log('ok, created application biatch', token);
    // Create an Application with a Room, ready to receive sockets
    var app = new require('../applications/TheWar/Application.js');

    token2app[token] = app;
    res.render(app.gameKey + '/board', { token : token });
};