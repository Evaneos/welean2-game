var token2app = require('../token.js');

module.exports = function(req, res) {
    var name = req.param('name');

    if (name) {
        console.log('set cookie bataw');
        res.cookie('user', { name: name });
    }
    res.redirect(req.path);
};