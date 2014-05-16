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
        this.roundStarted = false;
        this.cardsPlayers = {};
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
        S.forEach(this.room.users, (player) => {
            console.log("----------"+player.name+"'s hand-----");
            console.log(player.hand);
            console.log("-----------------------------");
        });
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
            this.playCard(player, card);
        });
    },
    playCard(player, card = null) {
        if (!player.active || player.hand.length === 0) {
            throw new Error("player.deactivated.play");
        }
        if(card === null) {
            card = player.getFirstCard();
        } else {
            player.removeCardFromHand(card);
        }
        this.cardsPlayers[card.name] = player;
        this.cardPlayed(card);
    },
    cardPlayed(card) {
        this.currentCards.push(card);
    },
    startRound(players=[]) {
        
        if (this.roundStarted) {
            console.log("Round already started !");
            return;
        }
        
        this.roundStarted = true;
        
        this.roundNumber++;
        this.playersForRound = [];
        this.currentCards = [];
        
        if (players.length <= 0) {
            console.log("All users play round "+this.roundNumber);
            S.forEach(this.room.users, (player) => {
                if (player.active && player.hand.length > 0) {
                    console.log(player.name+" has "+player.hand.length+" cards in his hand");
                    this.playersForRound.push(player);
                } else {
                    console.log(player.name+"(deactivated) has "+player.hand.length+" cards in his hand");
                }
            });
        } else {
            players.forEach((player)=>{
                console.log(player.name+" has "+player.hand.length+" cards in his hand");
                this.playersForRound.push(player);
            });
        }
    },
    endRound() {
        var winners = this.resolveRoundWinner();
        var numberWinners = winners.length;
        
        this.roundStarted = false;
        
        if(numberWinners === 0) {
            this.resolveNoWinnerRound();
        } else if(numberWinners > 1) {
            this.resolveTieRound(winners);
        } else {
            this.awardWinner(winners[0]);
        }
    },
    resolveCardsPlayers(cards) {
        var players = [];
        
        cards.forEach((card)=>{
            players.push(this.cardsPlayers[card.name]);
        });
        
        return players;
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