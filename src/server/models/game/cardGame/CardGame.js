var Application = require('../../common/Application');
var Deck = require('./Deck');

var CardGame = Application.extend();
module.exports = CardGame;

CardGame.extendPrototype({
	construct(socket, token, usersMax, usersMin) {
		CardGame.superConstruct.apply(this, arguments);
		this.deck = this.buildDeck();
    },
    run() {
    	console.log("Let's Play !");
    },
    buildDeck() {
    	console.log("Building deck...");
    	return new Deck();
    },
    shuffleDeck() {
    	console.log("Shuffling deck...");
    	this.deck.shuffle();
    },
    drawCard(number=1) {
    	console.log("Drawing "+number+" cards...");
    	return this.deck.draw(number);
    }
});