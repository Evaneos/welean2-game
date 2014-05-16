document.addEventListener( "DOMContentLoaded", main, false );

function main() {
    if (client && client == 'device' && token) {
        mainClient(token);
    }
    else if (client && client == 'board' && token) {
        mainBoard(token);
    }
    else {
        console.info("ahahah");
    }
}

function mainClient(token) {
    console.info("client", token);
}

function mainBoard(token) {
    console.info("board", token);
    var socket = io.connect('http://localhost');
    socket.emit('room:join', { token : token });
}