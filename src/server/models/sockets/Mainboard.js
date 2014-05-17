var Mainboard = S.extendClass(require('events').EventEmitter);
module.exports = Mainboard;

Mainboard.extendPrototype({
    construct(application, socket) {
        this.application = application;
        this.socket = socket;

        // Sockets events
        socket.on('disconnect', this._onDisconnect.bind(this));


        // Application events
        application.on('player:ready', this._onPlayerReady.bind(this));

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

    _onPlayerReady(name) {
        this.emitClient('player:ready', name);
    },
    _onDisconnect() {
        this.application.removeMainboard(this);
    },
});