global.S = require('springbokjs-utils');
document.addEventListener( "DOMContentLoaded", main, false );

function main() {
    var token = window.token, client = window.client, name = window.name;
    console.log('DEVICE');
    var socket = io.connect('/');
    global.socket = socket;
    socket.emit('room:join', { token : token, client: client, name: name });

    //$('.welcome').hide();$('.game').show()
    var welcomeScreen = $('.welcome');
    var readyInfo = $('.iamready');
    var buttonReady = welcomeScreen.find('.button').on('click', function(e) {
        e.preventDefault();
        buttonReady.hide();
        readyInfo.show();
        socket.emit('ready');
    });

    var gameScreen = $('.game');
    var mydeck = gameScreen.find('.my-deck');
    var logList = gameScreen.find('.log');
    var rightside = logList.parent();

    var log = function(message) {
        logList.append($('<li>').text(message));
    };

    var myTurn = false;
    mydeck.on('touchstart', function() {
        log('You started touching your deck');
        rightside.prop('scrollTop', rightside.prop('scrollHeight'));
    });
    mydeck.on('touchend', function() {
        log('You stopped touching your deck');
        rightside.prop('scrollTop', rightside.prop('scrollHeight'));
        if (myTurn) {
            log('You played a card');

            var clone = mydeck.clone();

            mydeck.after(clone);

            socket.emit('playCard');

            clone.animate(
                {
                    'top': '-500px'
                },
                1500,
                function() {
                    $(this).remove();
                }
            );

            myTurn = false;
        }
    });

    // Events
    socket.on('player:connected', function(username) {
        console.log('player:connected', username);
    });
    socket.on('player:disconnected', function(username) {
        console.log('player:disconnected', username);
    });

    socket.on('application:started', function(username) {
        log("Start");
        if (window.navigator.vibrate) {
            window.navigator.vibrate([30, 30, 30]);
        }
        welcomeScreen.hide();
        gameScreen.show();
        myTurn = true;
    });
    socket.on('application:ended', function() {
        readyInfo.hide();
        buttonReady.show();
        gameScreen.hide();
        welcomeScreen.show();
    });


    socket.on('cardPlayed', function(data) {
        log('cardPlayed' + data.cardId);
    });

    socket.on('round:lost', function() {
        log('You lost the round :( Maybe the next one :)');
    });
    socket.on('round:won', function() {
        log('You won the round !!!');
    });
    socket.on('round:started', function() {
        if (window.navigator.vibrate) {
            window.navigator.vibrate([100,30]);
        }
        log("It's your turn");
        myTurn = true;
    });
}
