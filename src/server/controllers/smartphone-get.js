var token2app = require('../token.js');

module.exports = function(req, res) {
    var token = req.params.token;
    var user = req.cookies && req.cookies.user;
    var app = token2app[token];
    if (!user) {
        res.render(app.gameKey + '/device/auth', { });
    }
    else {
        res.render(app.gameKey + '/device/index', { name: user.name });
    }
};