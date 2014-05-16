var CardGame = require('../CardGame');
var ClassicDeck = require('../classic/ClassicDeck');

var Bataille = CardGame.extend();
module.exports = Bataille;

Bataille.extendPrototype({
	construct(socket, token) {
		Bataille.superConstruct.call(this, socket, token, 2, 4);
    },
    buildDeck() {
    	console.log("Building deck...");
    	return new ClassicDeck(52);
    },
    run() {
    	console.log("Let's Play Bataille !");
    }
});