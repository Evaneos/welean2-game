var Player = require('../Player');

var CardPlayer = Player.extend();
module.exports = CardPlayer;

CardPlayer.extendPrototype({
	construct(socket, name) {
		CardPlayer.superConstruct.call(this, socket, name);
		this.hand = [];
    },
    addCardToHand(card) {
    	this.hand.push(card);
    },
    removeCardFromHand(card) {
    	S.array.remove(this.hand, card);
    }
});