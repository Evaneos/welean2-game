var token2app = require('../token.js');

module.exports = function(req, res) {
    var token = req.params.token;

    if (token2app[token]) {
        var app = token2app[token];
        res.render(app.gameKey + '/client');
    }
    else {
        res.json({});
    }
};