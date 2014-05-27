var socketio = require('socket.io');

var SocketApplication = require('./models/sockets/Application');

module.exports = function(argv) {
    var io = socketio.listen(argv.websocketPort || 3300);

    /* #if PROD */
    if (argv.production) {
        io.enable('browser client minification'); // send minified client
        io.enable('browser client etag'); // apply etag caching logic based on version number
        io.enable('browser client gzip'); // gzip the file
        io.set('log level', 1); // reduce logging
    }
    /* #/if */

    io.set('close timeout',120);
    io.set('heartbeat timeout',120);
    io.set('heartbeat interval',300);

    io.sockets.on('connection', function(socket) {
        socket.on('connect', console.log.bind(console, 'connect'));
        socket.on('connection', console.log.bind(console, 'connection'));
        socket.on('room:join', function(data) {
            var game = SocketApplication.getOrCreate(data.token);
            if (!game) {
                throw new Error("Impossible de créer l'application");
            }
            try {
                game.addClient(socket, data);
            } catch(e) {
                console.error(e.stack || e.message);
            }
        });
    });
};
