global.S = require('springbokjs-utils');

var assert = require('proclaim');
var expect = assert.strictEqual;

var CardPlayer = require('../lib/server/models/game/cardGame/CardPlayer');
var Bataille = require('../lib/server/models/game/cardGame/bataille/Bataille');
var ClassicCard = require('../lib/server/models/game/cardGame/classic/ClassicCard');
var ClassicDeck = require('../lib/server/models/game/cardGame/classic/ClassicDeck');

test('test Bataille', function() {
	console.log("======================================================");
	console.log("=====================BATAILLE=========================");
	console.log("======================================================");
    var bataille = new Bataille(null, "batailleToken");
	
    var player1 = new CardPlayer(null, "foo");
    var player2 = new CardPlayer(null, "bar");
    var player3 = new CardPlayer(null, "toto");
    var player4 = new CardPlayer(null, "tutu");
    
    bataille.join(player1);
    bataille.join(player2);
    bataille.join(player3);
    bataille.join(player4);
    
    player1.markAsReady();
    player2.markAsReady();
    player3.markAsReady();
    player4.markAsReady();
    
    bataille.start();
    
    var i = 0;
    var max = 50;
    do {
        bataille.playCard(player1);
        bataille.playCard(player2);
        bataille.playCard(player3);
        bataille.playCard(player4);
        bataille.endRound();
        if(player1.hand.length > 0 && player2.hand.length > 0 && player3.hand.length > 0 && player4.hand.length > 0) {
            if (!bataille.roundStarted) {
                bataille.startRound();
                i++;
            }
        } else {
            break;
        }
    } while(i<max);
    
    console.log(player1.name+" has "+player1.hand.length+" cards in his hand");
    console.log(player2.name+" has "+player2.hand.length+" cards in his hand");
    console.log(player3.name+" has "+player3.hand.length+" cards in his hand");
    console.log(player4.name+" has "+player4.hand.length+" cards in his hand");
    
    bataille.end();
    console.log("======================================================");
    console.log("======================================================");
});

