var Player = require('../Player');

var CardPlayer = Player.extend();
module.exports = CardPlayer;

CardPlayer.extendPrototype({
    construct(socket, name) {
        CardPlayer.superConstruct.call(this, socket, name);
        this.hand = [];
    },
    hasCardInHand(card){
        return (S.array.has(this.hand, card));
    },
    addCardToHand(card, under=false) {
        if(under) {
            this.hand.unshift(card);
        } else {
            this.hand.push(card);
        }
    },
    removeCardFromHand(card) {
        if (!this.hasCardInHand(card)) {
            throw new Error("player.card.notInHand");
        }
        S.array.remove(this.hand, card);
    },
    getFirstCard() {
        if (this.hand.length === 0) {
            throw new Error("player.hand.empty");
        }
        return this.hand.pop();
    }
});