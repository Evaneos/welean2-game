var Deck = require('../Deck');
var ClassicCard = require('./ClassicCard');

var ClassicDeck = Deck.extend();
module.exports = ClassicDeck;

ClassicDeck.extendPrototype({
	construct(number=52) {
		if(number !== 52 || number !== 32) {
			throw new Error("deck.impossible.54or32cards");
		}
		ClassicCard.superContruct.call(this, number);
    },
    build() {
    	var cards = [];
		ClassicCard.colors.forEach((color) => {
			ClassicCard.values.forEach((value) => {
				if (this.number == 52 || (value!==2 && value!==3 && value!==4 && value!==5 && value!==6)) {
					cards.push(new ClassicCard(value+" of "+color, value, color));
				}
			});
		});
    	return cards;
    }
});