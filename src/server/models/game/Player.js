var User = require('../common/User');

var Player = User.extend();
module.exports = Player;

Player.extendPrototype({
    construct(socket, name) {
        Player.superConstruct.call(this, socket, name);
        this.active = false;
    },
    activate() {
        this.active = true;
        this.emit("activated");
    },
    deactivate() {
        this.active = false;
        this.emit("deactivated");
    }
});