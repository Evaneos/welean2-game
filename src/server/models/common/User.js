var User = S.newClass();
module.exports = User;

User.defineProperty("States", { IDLE : 1, READY : 2, AWAY : 3});

User.extendPrototype({
	construct(socket, name) {
        this.name = name;
        this.socket = socket;
        this.state = User.States.IDLE;
    },
    changeToState(state) {
    	if (S.array.has(User.States, state)) {
    		this.state = state;
    	}
    },
    ready() {
    	return (this.state == User.States.READY);
    }
});