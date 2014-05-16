var Application = require('../../common/Application');
var Deck = require('./Deck');

var CardGame = Application.extend();
module.exports = CardGame;

CardGame.extendPrototype({
	construct(socket, token, usersMax, usersMin) {
		CardGame.superConstruct.apply(this, arguments);
		this.deck = this.buildDeck();
		this.currentCards = [];
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
    deal(numberPerPlayer=0) {
    	var i = 0;
    	while((numberPerPlayer===0 || i<numberPerPlayer) && this.deck.remaining>0 ) {
	    	S.forEach(this.room.users, (player) => {
	    		player.addCardToHand(this.deck.draw(i));
	    	});
    		i++;
    	}
    },
    drawCard(player, number=1) {
    	console.log("Drawing "+number+" cards...");
    	player.addCardToHand(this.deck.draw(number));
    },
    winningCards(cards) {
    	console.log("I can't decide!");
    },
    play(player, cards) {
    	console.log(player.name+" plays "+cards.length+" cards from his hand");
    	cards.forEach((card)=>{
    		console.log(card.name);
    		player.removeCardFromHand(card);
    		this.currentCards.push(card);
    	});
    }
});