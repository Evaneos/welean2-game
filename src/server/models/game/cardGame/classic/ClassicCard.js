var Card = require('../Card');

var ClassicCard = Card.extend();
module.exports = ClassicCard;

ClassicCard.defineProperty("colors", { HEARTS : 'Hearts', DIAMONDS : 'Diamonds', CLUBS : 'Clubs', SPADES : 'Spades'});
ClassicCard.defineProperty("values", {
	1:'Ace', 2:'2', 3:'3', 4:'4', 5:'5', 6:'6', 7:'7', 8:'8', 9:'9', 10:'10', JACK:'Jack', QUEEN:'Queen', KING:'King' }
);

ClassicCard.extendPrototype({
	construct(name, value, color) {
		ClassicCard.superConstruct.call(this, name);
		this.value = value;
		this.color = color;
    }
});