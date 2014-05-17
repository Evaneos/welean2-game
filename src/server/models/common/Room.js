var Room = S.extendClass(require("events").EventEmitter);
module.exports = Room;

Room.defineProperty("states", { WAITING_FOR_USERS : 1, MIN_USERS_REACHED : 2, ROOM_FULL : 3});
Room.defineProperty("statesValues", Object.keys(Room.states).map((v) => Room.states[v]));

Room.extendPrototype({
    construct(token, usersMax, usersMin=0) {
        this.token = token;
        this.usersMax = usersMax;
        this.usersMin = usersMin;
        this.users = {};
        this.usersCount = 0;
        this.checkUsers();
    },
    exists(user) {
        return (this.users[user.name] !== undefined);
    },
    addUser(user) {
        if (this.usersCount >=  this.usersMax) {
            throw new Error("user.max.reached");
        }

        if (this.exists(user)) {
            throw new Error("user.name.alreadyExists");
        }

        this.users[user.name] = user;
        this.emit('userAdded', user);
        this.usersCount++;
        this.checkUsers();

    },
    removeUser(user) {
        if (!this.exists(user)) {
            throw new Error("user.notFound");
        }

        delete this.users[user.name];
        this.usersCount--;
        this.checkUsers();
        this.emit('userRemoved', user);
    },
    checkUsers() {
        if (this.usersCount >= this.usersMin) {
            this.changeToState(Room.states.MIN_USERS_REACHED);
        } else if (this.usersCount === this.usersMax) {
            this.changeToState(Room.states.ROOM_FULL);
        } else {
            this.changeToState(Room.states.WAITING_FOR_USERS);
        }
    },
    changeToState(state) {
        if (!S.array.has(Room.statesValues, state)) {
            throw new Error("room.state.notAvailable");
        }
        this.state = state;
        this.emit("roomStatusChanged", state);
    },
    ready() {
        if (this.state === Room.states.WAITING_FOR_USERS) {
            return false;
        }

        return !S.some(this.users, (element) => {
            if (!element.ready()) {
                return true;
            }
        });
    }
});