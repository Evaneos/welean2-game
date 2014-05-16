var User = require('../common/User');

var Player = User.extend();
module.exports = Player;

Player.extendPrototype({
	construct(socket, name) {
		Player.superContruct.call(this, socket, name);
    }
});