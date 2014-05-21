var User = S.extendClass(require('events').EventEmitter);
module.exports = User;


User.extendPrototype({
    construct(application, socket, data) {
        console.log('new User', data);
        this.application = application;
        this.name = data.name;
        this._changeSocket(socket);
        this._initialData();
        // TODO parent / common Mainboard + User
        
        this.on('application:started', () => this.myturn = true);
        this.on('application:ended', () => this.myturn = true);
        this.on('round:started', () => this.myturn = true);
    },

    _changeSocket(socket) {
        this.connected = true;
        this.socket = socket;
        socket.on('disconnect', this._onDisconnect.bind(this));
        socket.on('ready', this._onReady.bind(this));
        socket.on('playCard', this._onPlayCard.bind(this));
    },
    _initialData() {
        this.socket.emit('initialData', {
            started: this.application.isStarted(),
            applicationState: this.application.state,
            myturn: this.myturn,
        });
    },


    isConnected() {
        return this.connected;
    },

    reconnect(socket) {
        this._changeSocket(socket);
        if (this.deleteTimeoutID !== undefined) {
            clearTimeout(this.deleteTimeoutID);
            delete this.deleteTimeoutID;
        }
        if (this.application.isPaused()) {
            this.application.tryToUnpause();
        }
        this._initialData();
    },

    delete() {
        this.application.removeUser(this);
    },

    _onDisconnect() {
        this.connected = false;
        delete this.socket;
        this.emitServer('disconnected');
        this.deleteTimeoutID = setTimeout(() => {
            this.delete();
        }, 10000);
    },
    _onReady() {
        logger.log('user ready:' + this.name);
        this.user.markAsReady();
        this.emitServer('ready');
    },
    _onPlayCard(data) {
        this.myturn = false;
        if (data && data.cheat) {
            this.application.app.cheat(this.user);
        }
        var card = this.application.app.playCard(this.user);
        var emitData = { userName: this.name, cardId: card.id };
        this.application.emitToMainBoards('player:cardPlayed', emitData);
        this.emitClient('cardPlayed', emitData);
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
        if (this.socket) {
            console.log('User.emitClient', this.name, event, data);
            this.emit(event, data);
            this.socket.emit(event, data);
        } else {
            console.log('cannot emit, user is disconnected', this.name, event, data);
        }
    }
});