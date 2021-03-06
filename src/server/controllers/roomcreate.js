var token2app = require('../token.js');
var generator = require('springbokjs-utils/generator');
var ApplicationFactory = require('../factories/ApplicationFactory.js');

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
    var app = new ApplicationFactory().get(gameKey, token, req.query);

    token2app[token] = app;

    res.redirect('/board/' + token);//render(gameKey + '/roomboard/index', { token : token });
};