global.S = require('springbokjs-utils');

var assert = require('proclaim');
var expect = assert.strictEqual;

var Room = require('../lib/server/models/common/Room');
var User = require('../lib/server/models/common/User');

test('test Room', function() {
    var room = new Room("mytoken", 5, 2);
    
    expect("mytoken", room.token);
    expect(5, room.usersMax);
    expect(2, room.usersMin);
    
    var user1 = new User(null, "foo");
    var user2 = new User(null, "bar");
    
    expect(false, room.exists(user1));
    room.addUser(user1);
    expect(true, room.exists(user1));
    
    room.addUser(user2);
    expect(true, room.exists(user1));
    expect(true, room.exists(user2));
    
    expect(Room.states.MIN_USERS_REACHED, room.state);
    
    room.removeUser(user1);
    expect(false, room.exists(user1));
    
    expect(Room.states.WAITING_FOR_USERS, room.state);
    
    room.changeToState(Room.states.MIN_USERS_REACHED);
    
    assert.throws(function() {
    	room.changeToState("foo");
	}, "room.state.notAvailable");
    
    room.addUser(user1);
    user1.changeToState(User.states.READY);
    expect(false, room.ready());
    
    user2.changeToState(User.states.READY);
    expect(true, room.ready());
});