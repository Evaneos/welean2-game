global.S = require('springbokjs-utils');
require('springbokjs-shim/es6');

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
    var bataille = new Bataille("batailleToken");
	
    var player1 = new CardPlayer("foo");
    var player2 = new CardPlayer("bar");
    var player3 = new CardPlayer("toto");
    var player4 = new CardPlayer("tutu");
    
    bataille.join(player1);
    bataille.join(player2);
    bataille.join(player3);
    bataille.join(player4);
    
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
        console.log("############################ FINISHED #########################"); 
    });
    
    bataille.start();
});

