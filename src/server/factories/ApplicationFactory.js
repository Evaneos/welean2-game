var Bataille = require('../models/game/cardGame/bataille/Bataille');

var ApplicationFactory = S.newClass();
module.exports = ApplicationFactory;

ApplicationFactory.extendPrototype({
	construct() {
    },
    get(key, socket, token) {
    	return new Bataille(socket, token);
    }
});