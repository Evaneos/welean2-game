document.addEventListener( "DOMContentLoaded", main, false );

function main() {
    if (client && client == 'device' && token) {
        var app = require('./device.js');
        app.run(token);
    }
    else if (client && client == 'board' && token) {
        var app = require('./board.js');
        app.run(token);
    }
    else {
        console.info("ahahah");
    }
}