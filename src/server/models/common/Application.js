var Room = require('./Room');

var Application = S.extendClass(require("events").EventEmitter);
module.exports = Application;

Application.extendPrototype({
    construct(socket, token, usersMax, usersMin) {
        this.socket = socket;
        this.token = token;
        this.room = new Room(token, usersMax, usersMin);
        this.started  = false;
    },
    start() {
        if (this.room.ready() && this.started === false) {
            this.started = true;
            
            S.forEach(this.room.users, (player) => {
                player.active = true;
            });
            
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
    },
    join(user) {
        this.room.addUser(user);
    },
    quit(user) {
        this.room.removeUser(user);
    }
});