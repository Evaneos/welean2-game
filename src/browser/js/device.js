global.S = require('springbokjs-utils');
document.addEventListener( "DOMContentLoaded", main, false );

var vibrate = function(arg) {
    if (window.navigator.vibrate) {
        window.navigator.vibrate(arg);
    }
};

var Popup = require('./Popup');

function main() {
    var popup = new Popup();
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
        rightside.prop('scrollTop', rightside.prop('scrollHeight'));
    };

    var myTurn = false;
    mydeck.on('touchstart', function() {
        
    });
    mydeck.on('touchend', play);
    mydeck.on('click', play);
    
    function play() {
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
    }

    // Events
    socket.on('player:connected', function(username) {
        console.log('player:connected', username);
    });
    socket.on('player:disconnected', function(username) {
        console.log('player:disconnected', username);
    });
    socket.on('player:left', function(username) {
        console.log('player:left', username);
    });


    socket.on('application:started', function(username) {
        log("Start");
        vibrate([30, 30, 30]);
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
    socket.on('bataille', function(data) {
        log('bataille !!!');
        vibrate([100]);
        popup.display('Bataille !');
    });

    socket.on('round:lost', function() {
        log('You lost the round :( Maybe the next one :)');
    });
    socket.on('round:won', function() {
        log('You won the round !!!');
    });
    socket.on('round:started', function() {
        log("It's your turn");
        myTurn = true;
        popup.display('A ton tour');
    });
}
