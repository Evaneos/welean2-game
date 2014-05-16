global.S = require('springbokjs-utils');

var assert = require('proclaim');
var expect = assert.strictEqual;

test('first test', function() {
    expect(' '.trim(), '');
    
    var number = Number('foo');
    var number2 = Number('2');
    
    assert.ok(true, isNaN(number));
    expect(2, number2);
});

