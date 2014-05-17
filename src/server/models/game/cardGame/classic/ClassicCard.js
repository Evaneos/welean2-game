// Used in front too
var Card = require('../Card');

var ClassicCard = Card.extend();
module.exports = ClassicCard;

ClassicCard.defineProperty("colors", { HEARTS : 'h', DIAMONDS : 'd', CLUBS : 'c', SPADES : 's'});
ClassicCard.defineProperty("colorsValues", Object.keys(ClassicCard.colors).map((v) => ClassicCard.colors[v]));

ClassicCard.defineProperty("values", {
    ACE:'a',
    TWO:'02',
    THREE:'03',
    FOUR:'04',
    FIVE:'05',
    SIX:'06',
    SEVEN:'07',
    HEIGHT:'08',
    NINE:'09',
    TEN:'10',
    JACK:'j',
    QUEEN:'q',
    KING:'k'
});
ClassicCard.defineProperty("valuesValues", Object.keys(ClassicCard.values).map((v) => ClassicCard.values[v]));

ClassicCard.defineProperty("generateId", function (color, value) { return color + '_' + value; });
ClassicCard.defineProperty("getIds", function () {
    if (ClassicCard.ids) {
        return ClassicCard.ids;
    }

    var ids = [];

    S.forEach(ClassicCard.colors, (color) => {
        S.forEach(ClassicCard.values, (value) => {
            ids.push(ClassicCard.generateId(color, value));
        });
    });

    ClassicCard.defineProperty("ids", ids);

    return ids;
});

ClassicCard.extendPrototype({
    construct(name, value, color) {
        ClassicCard.superConstruct.call(this, name);
        this.value = value;
        this.color = color;
        this.id = ClassicCard.generateId(color, value);
    }
});
