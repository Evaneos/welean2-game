var CardGame = require('../CardGame');
var ClassicDeck = require('../classic/ClassicDeck');

var Bataille = CardGame.extend();
module.exports = Bataille;

Bataille.extendPrototype({
	construct(socket, token) {
		Bataille.superConstruct.call(this, socket, token, 2, 4);
		this.shuffleDeck();
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