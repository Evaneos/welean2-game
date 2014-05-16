var User = S.newClass();
module.exports = User;

User.defineProperty("states", { IDLE : 1, READY : 2, AWAY : 3});
User.defineProperty("statesValues", Object.keys(User.states).map((v) => User.states[v]));

User.extendPrototype({
	construct(socket, name) {
        this.name = name;
        this.socket = socket;
        this.state = User.states.IDLE;
    },
    changeToState(state) {
    	if (!S.array.has(User.statesValues, state)) {
    		throw new Error("user.state.notAvailable");
    	}
    	this.state = state;
    },
    ready() {
    	return (this.state === User.states.READY);
    }
});