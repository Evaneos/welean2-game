var Room = require('./Room');
var User = require('./User');

var Application = S.extendClass(require("events").EventEmitter);
module.exports = Application;

Application.extendPrototype({
    construct(token, usersMax, usersMin) {
        this.token = token;
        this.room = new Room(token, usersMax, usersMin);
        this.started  = false;
    },
    start() {
        if (this.canBeStarted()) {
            console.log('can start');
            S.forEach(this.room.users, (player) => {
                player.activate();
            });
            
            this.started = true;
            this.emit('started');
            this.run();
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
        this.emit('ended');
    },
    join(user) {
        var userObj = null;
        if (user instanceof User) {
            userObj = user;
        } else if (S.isString(user)) {
            userObj = new User(user);
            
        } else {
            throw new Error("application.user.badType");
        }
        this.room.addUser(userObj);
        return userObj;
    },
    quit(user) {
        this.room.removeUser(user);
    },
    delete() {
        
    }
});