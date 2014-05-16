var token2app = require('../token.js');
var generator = require('springbokjs-utils/generator');
var applicationFactory = require('../factories/ApplicationFactory.js');

module.exports = function(req, res) {
    // res.render('smartphone', { myData : "myValue" });

    var gameKey = req.params.gameKey;

    if (gameKey != 'bataille') {
        return res.json(500, { error : 'only bataille allowed'});
    }

    var token, i = 0;

    while (!token || (token && token2app[token])) {
        token = generator.randomCode(7);
        if (i++ > 20) {
            return res.json(500, { error: 'Failed to generate token' });
        }
    }

    // Create an Application with a Room, ready to receive sockets
    var app = new applicationFactory().get(gameKey, null, token);

    token2app[token] = app;
    res.render(gameKey + '/roomboard/index', { token : token });
};