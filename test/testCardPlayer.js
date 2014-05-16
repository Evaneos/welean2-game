global.S = require('springbokjs-utils');
require('springbokjs-shim/es6');

var assert = require('proclaim');
var expect = assert.strictEqual;

var CardPlayer = require('../lib/server/models/game/cardGame/CardPlayer');
var User = require('../lib/server/models/common/User');
var Card = require('../lib/server/models/game/cardGame/Card');

test('test CardPlayer', function() {
	var user = new CardPlayer(null, "foo");
    
    expect("foo", user.name);
    expect(false, user.ready());
    
    user.changeToState(User.states.READY);
    expect(true, user.ready());
    
    assert.throws(function() {
		user.changeToState("foo");
	}, "user.state.notAvailable");
    
    var card1 = new Card("foo");
    var card2 = new Card("bar");
    
    user.addCardToHand(card1);
    user.addCardToHand(card2);
    
    expect(2, user.hand.length);
    
    user.removeCardFromHand(card1);
    expect(1, user.hand.length);
});

