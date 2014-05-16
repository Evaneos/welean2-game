var Card = require('../Card');

var ClassicCard = Card.extend();
module.exports = ClassicCard;

ClassicCard.defineProperty("colors", { HEARTS : 'Hearts', DIAMONDS : 'Diamonds', CLUBS : 'Clubs', SPADES : 'Spades'});
ClassicCard.defineProperty("colorsValues", Object.keys(ClassicCard.colors).map((v) => ClassicCard.colors[v]));

ClassicCard.defineProperty("values", {
    ACE:'Ace',
    TWO:'2',
    THREE:'3',
    FOUR:'4',
    FIVE:'5',
    SIX:'6',
    SEVEN:'7',
    HEIGHT:'8',
    NINE:'9',
    TEN:'10',
    JACK:'Jack',
    QUEEN:'Queen',
    KING:'King'
});
ClassicCard.defineProperty("valuesValues", Object.keys(ClassicCard.values).map((v) => ClassicCard.values[v]));

ClassicCard.extendPrototype({
    construct(name, value, color) {
        ClassicCard.superConstruct.call(this, name);
        this.value = value;
        this.color = color;
    }
});