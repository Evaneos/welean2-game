global.S = require('springbokjs-utils');
document.addEventListener( "DOMContentLoaded", main, false );

function main() {
    if (window.client && window.client == 'device' && window.token) {
        var app = require('./device.js');
        app.run(window.token, window.client, window.name);
    }
    else if (window.client && window.client == 'board' && window.token) {
        var appBoard = require('./board.js');
        appBoard.run(window.token, window.client);
    }
    else {
        console.info("ahahah");
    }
}