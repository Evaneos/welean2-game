document.addEventListener( "DOMContentLoaded", main, false );

function main() {
    var socket = io.connect('http://localhost');
    socket.on('news', function (data) {
        console.log(data);
        socket.emit('my other event', { message: 'bob' });
    });
}
