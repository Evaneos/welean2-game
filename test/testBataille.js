global.S = require('springbokjs-utils');

var assert = require('proclaim');
var expect = assert.strictEqual;

var CardPlayer = require('../lib/server/models/game/cardGame/CardPlayer');
var Bataille = require('../lib/server/models/game/cardGame/bataille/Bataille');
var ClassicCard = require('../lib/server/models/game/cardGame/classic/ClassicCard');
var ClassicDeck = require('../lib/server/models/game/cardGame/classic/ClassicDeck');

test('test Bataille', function() {
	var bataille = new Bataille(null, "cardToken");
	expect("cardToken", bataille.token);
    expect("cardToken", bataille.room.token);
    expect(4, bataille.room.usersMax);
    expect(2, bataille.room.usersMin);
    
    expect(52, bataille.deck.cards.length);
    expect(0, bataille.currentCards.length);
    
    var player = new CardPlayer(null, "foo");
    bataille.room.addUser(player);
    
    bataille.shuffleDeck();
    bataille.deal(5);
    
    cards = player.hand.slice();
    expect(5, player.hand.length);
    expect(47, bataille.deck.cards.length);
    
    expect(5, cards.length);
    bataille.play(player, cards);
    
    expect(5, bataille.currentCards.length);
    expect(0, player.hand.length);
    
    bataille.winningCards(cards);
    
    bataille.run();
});

