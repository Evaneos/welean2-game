var CardGame = require('../CardGame');
var ClassicDeck = require('../classic/ClassicDeck');
var ClassicCard = require('../classic/ClassicCard');

var Bataille = CardGame.extend();
module.exports = Bataille;

Bataille.defineProperty("gameKey", "bataille");

Bataille.extendPrototype({
    construct(token, maxRounds=100) {
        Bataille.superConstruct.call(this, token, 4, 2, maxRounds);
        this.toWin = [];
    },
    buildDeck() {
        console.log("Building deck...");
        this.deck = new ClassicDeck(52);
        this.emit("deckBuilt", this.deck);
    },
    run() {
        console.log("Let's Play Bataille !");
        this.shuffleDeck();
        this.deal();
        this.startRound();
    },
    cardPlayed(card) {
        this.currentCards.push(card);
        this.toWin.push(card);
    },
    winningCards(cards) {
        var winning = [];
        var referenceCard = cards.pop();
        cards.forEach((card)=>{
            var score = this.compareCards(referenceCard, card);
            if (score>0) {
                console.log(card.name+" beats "+referenceCard.name);
                winning = [];
                referenceCard = card;
            } else if (score===0) {
                console.log(card.name+" ties "+referenceCard.name);
                winning.push(card);
            } else {
                console.log(referenceCard.name+" beats "+card.name);
            }
        });
        winning.push(referenceCard);

        return winning;
    },
    compareCards(reference, other) {
        if (reference.value === other.value) {
            return 0;
        }
        
        var refNumber = Number(reference.value);
        var otherNumber = Number(other.value);
        
        if (!isNaN(refNumber)) {
            if (!isNaN(otherNumber)) {
                return (otherNumber - refNumber);
            } else {
                return 1;
            }
        } else {
            if (!isNaN(otherNumber)) {
                return -1;
            } else {
                var beats = {};
                beats[ClassicCard.values.ACE] = [
                    ClassicCard.values.KING, ClassicCard.values.QUEEN, ClassicCard.values.JACK
                ];
                beats[ClassicCard.values.KING] = [ClassicCard.values.QUEEN, ClassicCard.values.JACK];
                beats[ClassicCard.values.QUEEN] = [ClassicCard.values.JACK];
                beats[ClassicCard.values.JACK] = [];
                
                return (S.array.has(beats[other.value], reference.value))?1:-1;
            }
        }
    },
    resolveRoundWinner() {
        var cards = this.winningCards(this.currentCards);
        return this.resolveCardsPlayers(cards);
    },
    resolveTieRound(winners) {
        var filteredWinners = [];
        winners.forEach((player)=>{
            if (this.checkLoser(player) === false) {
                filteredWinners.push(player);
            }
        });
        
        if (filteredWinners.length === 1) {
            this.finalizeRound(filteredWinners.pop());
        } else {
            this.emit("bataille", filteredWinners);
            this.startRound(filteredWinners);
        }
    },
    resolveNoWinnerRound() {
        throw new Error("bataille.impossible");
    },
    awardWinner(winner) {
        this.toWin.forEach((card)=>{
            winner.addCardToHand(card, true);
        });
        this.emit("roundWinner", winner, this.toWin);
        this.toWin = [];
    },
    declareGameWinner() {
        var winner = null;
        S.forEach(this.room.users, (player) => {
            if(winner === null || player.hand.length > winner.hand.length) {
                winner = player;
            }
        });
        this.emit("gameWinner", winner);
    }
});