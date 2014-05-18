var User = S.extendClass(require('events').EventEmitter);
module.exports = User;


User.extendPrototype({
    construct(application, socket, data) {
        console.log('new User', data);
        this.application = application;
        this.socket = socket;
        this.name = data.name;
        this.user = application.createUser(this, data.name);
        // TODO parent / common Mainboard + User
        socket.on('disconnect', this._onDisconnect.bind(this));
        socket.on('ready', this._onReady.bind(this));
        socket.on('playCard', this._onPlayCard.bind(this));
    },

    _onDisconnect() {
        this.application.removeUser(this);
    },
    _onReady() {
        logger.log('user ready:' + this.name);
        this.user.markAsReady();
        this.emitServer('ready');
    },
    _onPlayCard() {
        var card = this.application.app.playCard(this.user);
        var data = { userName: this.name, cardId: card.id };
        this.application.emitToMainBoards('player:cardPlayed', data);
        this.emitClient('cardPlayed', data);
    },
    isReady() {
        return this.user.ready();
    },
    markAsIdle() {
        return this.user.markAsIdle();
    },
    emitServer: function(event, data) {
        console.log('User.emitServer', event, data);
        this.emit(event, data);
        this.application.userEvent(this, event, data);
    },
    emitClient: function(event, data) {
        console.log('User.emitClient', event, data);
        this.emit(event, data);
        this.socket.emit(event, data);
    }
});