var socketio = require('socket.io');
module.exports = function(server, argv, cb) {
    var io = socketio.listen(server);

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

    cb(io);
};
