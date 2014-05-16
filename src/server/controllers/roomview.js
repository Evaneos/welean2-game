var token2app = require('../token.js');

module.exports = function(req, res) {

    var token = req.param('token');
    var app = token2app[token];
    console.info("roomview", app);

    res.render(app.self.gameKey + '/roomboard/index', { token : token });
};
