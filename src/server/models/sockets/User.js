var User = S.extendClass(require('events').EventEmitter);
module.exports = User;


var CommonUser = require('../common/User.js');


User.extendPrototype({
    construct(application, socket, data) {
        console.log('new User', data);
        this.application = application;
        this.socket = socket;
        this.name = data.name;
        this.user = new CommonUser(null, data.name);
        // TODO parent / common Mainboard + User
        socket.on('disconnect', this._onDisconnect.bind(this));
        socket.on('ready', this._onReady.bind(this));
        application.addUser(this);
    },

    _onDisconnect() {
        this.application.removeUser(this);
    },
    _onReady() {
        this.emitServer('ready');
        this.user.markAsReady();
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