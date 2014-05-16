var Room = S.newClass();
module.exports = Room;

Room.defineProperty("states", { WAITING_FOR_USERS : 1, MIN_USERS_REACHED : 2, ROOM_FULL : 3});

Room.extendPrototype({
	construct(token, usersMax, usersMin=0) {
        this.token = token;
        this.usersMax = usersMax;
        this.usersMin = usersMin;
        if (usersMin = 0) {
        	this.state = Room.states.MIN_USERS_REACHED;
        } else {
        	this.state = Room.states.WAITING_FOR_USERS;
        }
        
        this.users = {};
        this.usersCount = 0;
        
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
		this.usersCount++;
		
		if (this.usersCount === this.usersMin) {
			this.changeToState(Room.states.MIN_USERS_REACHED);
		} else if (this.usersCount === this.usersMax) {
			this.changeToState(Room.states.ROOM_FULL);
		}
    },
    removeUser(user) {
    	S.array.remove(this.users, user);
    },
    changeToState(state) {
    	if (S.array.has(Room.states, state)) {
    		this.state = state;
    	}
    },
    ready() {
    	if (this.state === Room.states.WAITING_FOR_USERS) {
    		return false;
    	}
    	
    	this.users.forEach((element, index) => {
    		if (!element.ready()) {
    			return false;
    		}
    	});
    }
});