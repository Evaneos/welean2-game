var Deck = require('../Deck');
var ClassicCard = require('./ClassicCard');

var ClassicDeck = Deck.extend();
module.exports = ClassicDeck;

ClassicDeck.extendPrototype({
	construct(number=52) {
<<<<<<< HEAD
		if(number !== 52 && number !== 32) {
			throw new Error("deck.impossible.52or32cards");
=======
        console.log("classic deck", number, arguments);
		if(number !== 52 && number !== 32) {
			throw new Error("deck.impossible.54or32cards");
>>>>>>> 13fd1c39ebe2d7fb9d477648fa6d5691e99c8936
		}
		ClassicDeck.superConstruct.call(this, number);
    },
    build() {
    	var cards = [];
		ClassicCard.colorsValues.forEach((color) => {
			ClassicCard.valuesValues.forEach((value) => {
				if (this.number == 52 || (value!==2 && value!==3 && value!==4 && value!==5 && value!==6)) {
					cards.push(new ClassicCard(value+" of "+color, value, color));
				}
			});
		});
    	return cards;
    }
});