var User = S.newClass();
module.exports = User;
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
        if (this.deleteTimeoutID !== undefined) {
            clearTimeout(this.deleteTimeoutID);
            delete this.deleteTimeoutID;
        }
        this.$eltList.css('text-decoration', 'none');

    },
    disconnect(callbackDeleted) {
        this.$eltList.css('text-decoration', 'line-through');
        this.deleteTimeoutID = setTimeout(() => {
            this.delete();
            callbackDeleted();
        }, 10000);
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
    }
});