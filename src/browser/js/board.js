module.exports = {
    run : function(token) {
        var socket = io.connect('http://localhost'),
            usersList = $('#list-users')
        ;

        // Join room
        socket.emit('room:join', { token : token, client: client });

        // List of players in this room
        socket.on('player:connected', function(data) {
            usersList.append($('<li />').attr('data-userid', data.user.id).text(data.user.name));
        });
        socket.on('player:disconnected', function(data) {
            usersList.find('[data-userid=' + data.user.id + ']').remove();
        });
    }
}
