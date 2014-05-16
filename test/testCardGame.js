global.S = require('springbokjs-utils');

var assert = require('proclaim');
var expect = assert.strictEqual;

var CardPlayer = require('../lib/server/models/game/cardGame/CardPlayer');
var CardGame = require('../lib/server/models/game/cardGame/CardGame');
var Card = require('../lib/server/models/game/cardGame/Card');
var Deck = require('../lib/server/models/game/cardGame/Deck');

test('test CardGame', function() {
	var cardGame = new CardGame(null, "cardToken", 5, 2);
	expect("cardToken", cardGame.token);
    expect("cardToken", cardGame.room.token);
    expect(5, cardGame.room.usersMax);
    expect(2, cardGame.room.usersMin);
    
    expect(0, cardGame.deck.cards.length);
    expect(0, cardGame.currentCards.length);
    
    var player = new CardPlayer(null, "foo");
    var card1 = new Card("foo");
    var card2 = new Card("bar");
    
    var cards = [card1, card2];
    
    cardGame.run();
    cardGame.shuffleDeck();
    cardGame.deal(1);
    
    assert.throws(function() {
    	cardGame.drawCard(player, 1);
    }, "deck.empty");
    
    cardGame.winningCards(cards);
    
    player.active = true;
    assert.throws(function() {
    	cardGame.play(player, cards);
    }, "player.card.notInHand");
    
    player.addCardToHand(card1);
    player.addCardToHand(card2);
    
    cardGame.play(player, cards);
});

