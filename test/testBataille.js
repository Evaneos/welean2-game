global.S = require('springbokjs-utils');
require('springbokjs-shim/es6');

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
    player.active = true;
    bataille.play(player, cards);
    
    bataille.winningCards(cards);
    
    bataille.start();
    
    
    var aceHearts = new ClassicCard("Ace of Hearts", ClassicCard.values.ACE, ClassicCard.colors.HEARTS);
    var jackHearts = new ClassicCard("Jack of Hearts", ClassicCard.values.JACK, ClassicCard.colors.HEARTS);
    var fiveHearts = new ClassicCard("5 of Hearts", ClassicCard.values.FIVE, ClassicCard.colors.HEARTS);
    var tenHearts = new ClassicCard("10 of Hearts", ClassicCard.values.TEN, ClassicCard.colors.HEARTS);
    
    var battleCards = [aceHearts, jackHearts, fiveHearts, tenHearts];
    
    var winning = bataille.winningCards(battleCards);
    expect(1, winning.length);
    expect(aceHearts, winning[0]);
    
    var aceClubs = new ClassicCard("Ace of Clubs", ClassicCard.values.ACE, ClassicCard.colors.CLUBS);
    
    var battleCards2 = [aceHearts, jackHearts, aceClubs, fiveHearts, tenHearts];
   
    var winning2 = bataille.winningCards(battleCards2);
    expect(2, winning2.length);
});

