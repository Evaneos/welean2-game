global.S = require('springbokjs-utils');

var assert = require('proclaim');
var expect = assert.strictEqual;

var User = require('../lib/server/models/common/User');

test('test User', function() {
    var user = new User(null, "foo");
    
    expect("foo", user.name);
    expect(false, user.ready());
    
    user.changeToState(User.states.READY);
    expect(true, user.ready());
    
    assert.throws(function() {
		user.changeToState("foo");
	}, "user.state.notAvailable");
});