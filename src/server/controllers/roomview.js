var token2app = require('../token.js');

module.exports = function(req, res) {

    var token = req.param('token');
    var app = token2app[token];
    if (!app) {
        return res.redirect('/');
    }

    res.render(app.self.gameKey + '/roomboard/index', { token : token });
};
