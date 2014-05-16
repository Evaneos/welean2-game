var Room = require('./Room');

var Application = S.newClass();
module.exports = Application;

Application.extendPrototype({
    construct(socket, token, usersMax, usersMin) {
        this.socket = socket;
        this.token = token;
        this.room = new Room(token, usersMax, usersMin);
        this.started  = false;
    },
    start() {
        if (this.room.ready() && started === false) {
            this.started = true;
            this.run();
        } else {
            console.log("Can't start!");
        }
    },
    run() {
        console.log("I am an abstract application, don't run me, moron!");
    },
    end() {
        this.started  = false;
    }
});