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
    },

    _onDisconnect() {
        this.application.removeUser(this);
    },
    _onReady() {
        this.user.markAsReady();
        this.emitServer('ready');
    },
    isReady() {
        return this.user.ready();
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