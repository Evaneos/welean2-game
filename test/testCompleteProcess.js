global.S = require('springbokjs-utils');
require('springbokjs-shim/es6');

var assert = require('proclaim');
var expect = assert.strictEqual;

var CardPlayer = require('../lib/server/models/game/cardGame/CardPlayer');
var Bataille = require('../lib/server/models/game/cardGame/bataille/Bataille');
var ClassicCard = require('../lib/server/models/game/cardGame/classic/ClassicCard');
var ClassicDeck = require('../lib/server/models/game/cardGame/classic/ClassicDeck');

test('test Bataille', function() {
    console.log("\n");
	console.log("======================================================");
	console.log("=====================BATAILLE=========================");
	console.log("======================================================");
    var bataille = new Bataille("batailleToken", {deckSize: 32, maxRounds: 10});
	
    var player1 = bataille.join("foo");
    var player2 = bataille.join("bar");
    var player3 = bataille.join("toto");
    var player4 = bataille.join("tutu");
    
    player1.markAsReady();
    player2.markAsReady();
    player3.markAsReady();
    player4.markAsReady();
    
    bataille.on("roundStarted", function(roundNumber, players){
        console.log("======== ROUND "+roundNumber+" STARTED ("+players.length+" players) =======");
        bataille.playCard(player1);
        bataille.playCard(player2);
        bataille.playCard(player3);
        bataille.playCard(player4);
    });
    
    bataille.on("started", function(){
        console.log("######################### BEGIN GAME #########################"); 
    });
    
    bataille.on("bataille", function(winners){
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~BATAILLE!~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    });
    
    bataille.on("roundEnded", function(roundNumber, winners) {
        console.log("======== ROUND "+roundNumber+" ENDED =======");
    });
    
    bataille.on("roundWinner", function(winner, cards) {
        console.log("======== ROUND WINNER : "+winner.name+" ("+cards.length+" cards) =======");
    });
    
    bataille.on("playerLost", function(player) {
        console.log("++++++++++++++++++ LOST : "+player.name+" +++++++++++++++++++++++++++");
    });
    
    bataille.on("gameWinner", function(winner){
        console.log("################### == WINNER : "+winner.name+" ("+winner.hand.length+") == ####################");
    });
    
    bataille.on("ended", function(){
        console.log("############################ FINISHED #########################\n"); 
    });
    
    bataille.start();
});

