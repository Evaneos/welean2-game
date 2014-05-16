var Deck = S.newClass();
module.exports = Deck;

Deck.extendPrototype({
	construct(number=0) {
		this.number = number;
		this.remaining = number;
		this.cards = this.build();
    },
    build() {
    	return [];
    },
    shuffle() {
    	this.cards.sort((a,b) => Math.round( Math.random() * 2 ) - 1);
    },
    draw(number=1) {
    	if (this.remaining === 0) {
    		throw new Error("deck.empty");
    	}
    	this.remaining--;
    	return this.cards.pop();
    }
});