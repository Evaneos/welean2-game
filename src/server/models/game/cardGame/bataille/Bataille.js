var CardGame = require('../CardGame');
var ClassicDeck = require('../classic/ClassicDeck');

var Bataille = CardGame.extend();
module.exports = Bataille;

Bataille.defineProperty("gameKey", "bataille");

Bataille.extendPrototype({
	construct(socket, token) {
<<<<<<< HEAD
		Bataille.superConstruct.call(this, socket, token, 4, 2);
=======
		// Bataille.superConstruct.call(this, socket, token, 2, 4);
		// this.shuffleDeck();
>>>>>>> 13fd1c39ebe2d7fb9d477648fa6d5691e99c8936
    },
    buildDeck() {
    	console.log("Building deck...");
    	return new ClassicDeck(52);
    },
    run() {
    	console.log("Let's Play Bataille !");
    },
    winningCards(cards) {
    	var winning = [];
    	var referenceCard = cards.pop();
    	cards.forEach((card)=>{
    		var score = this.compareCards(referenceCard, card);
    		if (score>1) {
    			winning = [];
    			referenceCard = card;
    		} else if (score===0) {
    			winning.push(card);
    		}
    	});
    	winning.push(referenceCard);

    	return winning;
    },
    compareCards(reference, other) {
    	//TODO
    	return -1;
    }
});