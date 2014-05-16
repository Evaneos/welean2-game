var token2app = require('../token.js');

module.exports = function(req, res) {
    var token = req.params.token;
    console.log('here');
    var user = req.cookies && req.cookies.user;
    console.log('there');
    var app = token2app[token];
    console.info(token2app, app);
    if (!user) {
        res.render(app.gameKey + '/device/auth', { });
    }
    else {
        res.render(app.gameKey + '/device/index', { name: user.name });
    }
};