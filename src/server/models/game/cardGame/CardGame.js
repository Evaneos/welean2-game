var Application = require('../../common/Application');
var Deck = require('./Deck');
var CardPlayer = require('./CardPlayer');

var CardGame = Application.extend();
module.exports = CardGame;

CardGame.extendPrototype({
    construct(token, usersMax, usersMin, maxRounds=50) {
        CardGame.superConstruct.apply(this, arguments);
        this.buildDeck();
        this.currentCards = [];
        this.playersForRound = [];
        this.played = new Set();
        this.roundNumber = 0;
        this.roundStarted = false;
        this.cardsPlayers = {};
        
        this.maxRounds = maxRounds;
        
        this.on("allPlayersPlayed", () => {
            this.endRound();
        });
        
        this.room.on("userAdded", (player) => {
            player.on("played", (card) => {
                this.played.add(player);
                if (this.played.size == this.playersForRound.length) {
                    this.emit("allPlayersPlayed");
                }
            });
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
        cards.forEach((card)=>{
            this.playCard(player, card);
        });
    },
    playCard(player, card = null) {
        if (!player.active || !S.array.has(this.playersForRound, player)) {
            return;
        }
        
        if(card === null) {
            card = player.getFirstCard();
        } else {
            player.removeCardFromHand(card);
        }
        this.cardsPlayers[card.name] = player;
        this.cardPlayed(card);
        player.emit("played", card);
    },
    cardPlayed(card) {
        this.currentCards.push(card);
    },
    clean() {
        this.playersForRound = [];
        this.played = new Set();
        this.currentCards = [];
    },
    startRound(players=[]) {
        
        if (this.roundStarted) {
            throw new Error("game.alreadyStarted");
        }
        
        this.clean();
        this.roundNumber++;
        
        if (players.length <= 0) {
            S.forEach(this.room.users, (player) => {
                this.addPlayerToRound(player);
            });
        } else {
            players.forEach((player)=>{
                this.addPlayerToRound(player);
            });
        }
        
        if (this.playersForRound.length === 0) {
            throw new Error("round.noPlayers");
        }
        
        this.roundStarted = true;
        
        this.emit("roundStarted", this.roundNumber, this.playersForRound);
    },
    finalizeRound(winner) {
        this.awardWinner(winner);
        
        S.forEach(this.room.users, (player) => {
            this.checkLoser(player);
        });
        
        if(this.roundNumber < this.maxRounds) {
            this.startRound();
        } else {
            this.end();
        }
    },
    endRound() {
        
        console.log(this.currentCards.length+" cards on table / "+this.toWin.length+" cards to win");
        
        var winners = this.resolveRoundWinner();
        var roundNumber = this.roundNumber;
        
        this.roundStarted = false;

        this.emit("roundEnded", roundNumber, winners);
        
        var numberWinners = winners.length;
        if(numberWinners === 0) {
            this.resolveNoWinnerRound();
        } else if(numberWinners > 1) {
            this.resolveTieRound(winners);
        } else {
            this.finalizeRound(winners[0]);
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
    },
    join(user) {
        var userObj = null;
        if (user instanceof CardPlayer) {
            userObj = user;
        } else if (S.isString(user)) {
            userObj = new CardPlayer(user);
        } else {
            throw new Error("cardGame.player.badType");
        }
        this.room.addUser(userObj);
        return userObj;
    },
    end() {
        this.clean();
        this.declareGameWinner();
        this.started  = false;
        this.emit('ended');
    },
    declareGameWinner() {
        console.log("I don't know!");
    },
    checkLoser(player) {
        if(player.hand.length === 0 && player.active === true) {
            player.deactivate();
            this.emit("playerLost", player);
            return true;
        } else {
            return false;
        }
    }
});