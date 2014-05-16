var User = S.extendClass(require('events').EventEmitter);
module.exports = User;


var CommonUser = require('../common/User.js');


User.extendPrototype({
    construct(application, socket) {
        this.application = application;
        this.socket = socket;
        this.user = new CommonUser();
        // TODO parent / common Mainboard + User
        socket.on('room:quit', (data) => {
            if (data.client == 'device') {
                this.application.removeUser(this);
            }
        });
        application.addUser(this);
    },
});