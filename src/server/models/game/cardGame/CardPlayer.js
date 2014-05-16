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
    addCardToHand(card) {
        this.hand.push(card);
    },
    removeCardFromHand(card) {
        if (!this.hasCardInHand(card)) {
            throw new Error("player.card.notInHand");
        }
        console.log("Removing card '"+card.name+"' from '"+this.name+"' hand");
        S.array.remove(this.hand, card);
    }
});