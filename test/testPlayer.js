global.S = require('springbokjs-utils');
require('springbokjs-shim/es6');

var assert = require('proclaim');
var expect = assert.strictEqual;

var Player = require('../lib/server/models/game/Player');
var User = require('../lib/server/models/common/User');

test('test Player', function() {
	var user = new Player(null, "foo");
    
    expect("foo", user.name);
    expect(false, user.ready());
    
    user.changeToState(User.states.READY);
    expect(true, user.ready());
    
    assert.throws(function() {
		user.changeToState("foo");
	}, "user.state.notAvailable");
});

