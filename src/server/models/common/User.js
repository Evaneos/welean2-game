var User = S.extendClass(require("events").EventEmitter);
module.exports = User;

User.defineProperty("states", { IDLE : 1, READY : 2, AWAY : 3});
User.defineProperty("statesValues", Object.keys(User.states).map((v) => User.states[v]));

User.extendPrototype({
    construct(name) {
        this.name = name;
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
    },
    markAsReady() {
        this.changeToState(User.states.READY);
        this.emit("ready");
    },
    markAsIdle() {
        this.changeToState(User.states.IDLE);
    }
});