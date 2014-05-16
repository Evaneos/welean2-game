var Application = require('../../common/Application');
var Deck = require('./Deck');

var CardGame = Application.extend();
module.exports = CardGame;

CardGame.extendPrototype({
    construct(socket, token, usersMax, usersMin) {
        CardGame.superConstruct.apply(this, arguments);
        this.buildDeck();
        this.currentCards = [];
        this.playersForRound = [];
        this.roundNumber = 0;
        this.roundStarted = false;
        this.cardsPlayers = {};
        
        this.on("roundStarted", () => {
            this.roundStarted = true;
        });
        
        this.on("roundEnded", () => {
            this.roundStarted = false;
        });
    },
    run() {
        console.log("Let's Play !");
    },
    buildDeck() {
        console.log("Building deck...");
        this.deck = new Deck();
    },
    shuffleDeck() {
        console.log("Shuffling deck...");
        this.deck.shuffle();
        this.emit('shuffled');
    },
    deal(numberPerPlayer=0) {
        var i = 0;
        while((numberPerPlayer===0 || i<numberPerPlayer) && this.deck.remaining>0 ) {
            S.forEach(this.room.users, (player) => {
                player.addCardToHand(this.deck.draw(i));
            });
            i++;
        }
        this.emit('dealt');
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
        if (!player.active) {
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
            throw new Error("game.alreadyStarted");
        }
        
        this.roundNumber++;
        
        this.playersForRound = [];
        this.currentCards = [];
        
        if (players.length <= 0) {
            S.forEach(this.room.users, (player) => {
                this.addPlayerToRound(player);
            });
        } else {
            players.forEach((player)=>{
                this.addPlayerToRound(player);
            });
        }
        
        this.emit("roundStarted", this);
    },
    endRound() {
        var winners = this.resolveRoundWinner();
        var numberWinners = winners.length;
        
        this.emit("roundEnded", this);
        
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
    },
    addPlayerToRound(player) {
        if (player.active) {
            this.playersForRound.push(player);
            this.emit("playerAddedToRound", player);
        }
    }
});