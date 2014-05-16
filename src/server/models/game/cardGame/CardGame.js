var Application = require('../../common/Application');
var Deck = require('./Deck');

var CardGame = Application.extend();
module.exports = CardGame;

CardGame.extendPrototype({
    construct(socket, token, usersMax, usersMin) {
        CardGame.superConstruct.apply(this, arguments);
        this.deck = this.buildDeck();
        this.currentCards = [];
        this.playersForRound = [];
        this.roundNumber = 0;
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
            player.removeCardFromHand(card);
            this.cardPlayed(card);
        });
    },
    cardPlayed(card) {
        this.currentCards.push(card);
    },
    startRound(players=[]) {
        
        this.round++;
        this.playersForRound = [];
        
        if (players.length <= 0) {
            console.log("All users play round "+this.round);
            S.forEach(this.room.users, (player) => {
                players.push(player);
            });
        }
        
        players.forEach((player)=>{
            this.playersForRound.push(player);
        });
    },
    endRound() {
        var winners = this.resolveRoundWinner();
        var numberWinners = winners.length;
        
        if(numberWinners === 0) {
            this.resolveNoWinnerRound();
        } else if(numberWinners > 1) {
            this.resolveTieRound(winners);
        } else {
            this.awardWinner(winners[0]);
        }
        
        this.playersForRound = [];
    },
    resolveRoundWinner() {
        console.log("I can't know that!");
        return [];
    },
    resolveTieRound(winners) {
        console.log("I can't do that!");
    },
    resolveNoWinnerRound() {
        console.log("I can't do that!");
    },
    awardWinner(winner) {
        console.log("I can't do that!");
    }
});