var Mainboard = S.extendClass(require('events').EventEmitter);
module.exports = Mainboard;

Mainboard.extendPrototype({
    construct(application, socket) {
        this.application = application;
        this.socket = socket;
        // TODO parent / common Mainboard + User
        socket.on('room:quit', (data) => {
            if (data.client == 'device') {
                this.application.removeMainboard(this);
            }
        });
        application.addMainboard(this);
    },
});