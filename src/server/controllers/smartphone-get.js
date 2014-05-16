var token2app = require('../token.js');

module.exports = function(req, res) {
    var token = req.params.token;
    var user = req.cookies && req.cookies.user;
    var app = token2app[token];
    if (!app) {
        return res.redirect('/');
    }
    if (!user) {
        res.render(app.self.gameKey + '/device/auth', { });
    }
    else {
        res.render(app.self.gameKey + '/device/index', { name: user.name, token: token });
    }
};
