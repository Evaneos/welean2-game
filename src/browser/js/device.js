module.exports = {
    run : function(token, client, name) {
        console.log('DEVICE');
        var socket = io.connect('http://localhost');
        global.socket = socket;
        socket.emit('room:join', { token : token, client: client, name: name });

        // List of players in this room
        socket.on('player:connected', function(username) {
            console.log('player:connected', username);
        });
        socket.on('player:disconnected', function(username) {
            console.log('player:disconnected', username);
        });
    }
};