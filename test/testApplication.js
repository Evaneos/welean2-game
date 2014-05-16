global.S = require('springbokjs-utils');
require('springbokjs-shim/es6');

var assert = require('proclaim');
var expect = assert.strictEqual;

var Application = require('../lib/server/models/common/Application');

test('test Application', function() {
    var app = new Application(null, "mytoken", 5, 2);
    expect("mytoken", app.token);
    expect("mytoken", app.room.token);
    expect(5, app.room.usersMax);
    expect(2, app.room.usersMin);
});