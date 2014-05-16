module.exports = {
    run : function(token) {
        var socket = io.connect('http://localhost');
        socket.emit('room:join', { token : token });
        console.info('device', token);
    }
}