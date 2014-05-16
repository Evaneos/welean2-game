var Card = S.newClass();
module.exports = Card;

Card.extendPrototype({
    construct(name) {
        this.name = name;
    }
});