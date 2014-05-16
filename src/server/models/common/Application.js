var Room = require('./Room');

var Application = S.newClass();
module.exports = Application;

Application.extendPrototype({
	construct(socket, token, usersMax, usersMin) {
		this.socket = socket;
		this.token = token;
        this.room = new Room(token, usersMax, usersMin);
    },
    start() {
    	if (this.room.ready()) {
    		this.run();
    	}
    },
    run() {
    	console.log("I am an abstract application, don't run me, moron!");
    }
});