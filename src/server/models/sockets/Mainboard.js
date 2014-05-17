var Mainboard = S.extendClass(require('events').EventEmitter);
module.exports = Mainboard;

Mainboard.extendPrototype({
    construct(application, socket) {
        this.application = application;
        this.socket = socket;

        // Sockets events
        socket.on('disconnect', this._onDisconnect.bind(this));


        // Application events
        application.on('board:ready', this._bindedOnPlayerReady = this._onPlayerReady.bind(this));

        this.socket.emit('initialData', application.initialData());
        application.addMainboard(this);
    },

    emitServer: function(event, data) {
        console.log('Mainboard.emitServer', event, data);
        this.emit(event, data);
        this.application.emit(event, data);
    },
    emitClient: function(event, data) {
        console.log('Mainboard.emitClient', event, data);
        this.emit(event, data);
        this.socket.emit(event, data);
    },
    isReady() {
        return this.ready;
    },
    markAsIdle() {
        return this.ready = false;
    },

    _onPlayerReady(name) {
        this.ready = true;
        this.emit('ready', name);
    },
    _onDisconnect() {
        this.application.removeMainboard(this);
        this.application.removeListener('player:ready', this._bindedOnPlayerReady);

        this.removeAllListeners();
        this.user.removeAllListeners();
    },
});