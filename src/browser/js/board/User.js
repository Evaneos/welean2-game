var User = S.newClass();
module.exports = User;


var generateCard = function(id) {
    var cssClass = 'sprite-deck-' + (id || 'backside');
    return '<div class="icon-big ' + cssClass + '"></div>';
};

User.extendPrototype({
    construct(name) {
        this.name = name;
        this.connected = true;
        this.$eltList = $('<li/>').text(name);
        this.$eltGame = $('<div class="user"><div class="card-container"></div><div class="name"></div></div>');
        User.usersList.append(this.$eltList);
        User.cardsContainer.append(this.$eltGame);
        this.$eltGame.find('.name').text(name);
    },
    isConnected() {
        return this.connected;
    },
    reconnect() {
        this.connected = true;
        this.$eltList.css('text-decoration', 'none');

    },
    disconnect() {
        this.$eltList.css('text-decoration', 'line-through');
    },
    delete() {
        this.$eltList.fadeOut(1000, function() { $(this).remove(); });
        this.$eltGame.remove();

        delete this.$eltList;
        delete this.$eltGame;
        delete this.$ready;
    },
    reset() {
        this.ready = false;
        if (this.$ready) {
            this.$ready.remove();
            delete this.$ready;
        }
    },
    markAsReady() {
        this.ready = true;
        this.$ready = $('<span> ✔</span>').appendTo(this.$eltList).fadeIn().fadeOut().fadeIn();
    },
    setCard(cardId) {
        var $oldCard = this.$card || false;
        var $card = $(generateCard(cardId));
        this.$card = $card;
        $card.css('top', '1000px');
        this.$eltGame.find('.card-container').append($card);
        $card.animate({'top': '0'}, 1000, () => {
            this.removeCard($oldCard);
        });
    },
    removeCard($card) {
        var $cardToRemove = $card !== undefined ? $card : this.$card;
        if ($cardToRemove) {
            $cardToRemove.fadeOut(function() {$(this).remove(); });
            if (!$card) {
                delete this.$card;
            }
        }
    }
});