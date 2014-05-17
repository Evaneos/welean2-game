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
        if (this.canBeStarted()) {
            S.forEach(this.room.users, (player) => {
                player.activate();
            });
            
            this.started = true;
            this.run();
            this.emit('started');
        } else {
            console.log("Can't start!");
        }
    },
    tryToStart() {
        this.start();
    },
    canBeStarted() {
        return this.room.ready() && this.started === false;
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
    },
    delete() {
        
    }
});