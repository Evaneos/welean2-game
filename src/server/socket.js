var socketio = require('socket.io');
module.exports = function(server) {
    var io = socketio.listen(server);

    /* #if PROD */
    /*io.enable('browser client minification'); // send minified client
    io.enable('browser client etag'); // apply etag caching logic based on version number
    io.enable('browser client gzip'); // gzip the file
    io.set('log level', 1); // reduce logging
    io.set('transports', [
    'websocket'
    // , 'flashsocket'
    , 'htmlfile'
    , 'xhr-polling'
    , 'jsonp-polling'
    ]);*/
    /* #/if */

    io.set('close timeout',120);
    io.set('heartbeat timeout',120);
    io.set('heartbeat interval',300);

    io.sockets.on('connection', function(socket) {
        socket.emit('news', { hello: 'world' });
        socket.on('my other event', function (data) {
            console.log(data);
        });
    });
};
