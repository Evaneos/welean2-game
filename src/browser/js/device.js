global.S = require('springbokjs-utils');
document.addEventListener( "DOMContentLoaded", main, false );

function main() {
    var token = window.token, client = window.client, name = window.name;
    console.log('DEVICE');
    var socket = io.connect('http://localhost');
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
    var mydeck = gameScreen.find('.mydeck');
    var log = gameScreen.find('.log');
    var rightside = log.parent();
    mydeck.on('touchstart', function() {
        log.append($('<li>').text('You started touching your deck'));
        rightside.prop('scrollTop', rightside.prop('scrollHeight'));
    });
    mydeck.on('touchend', function() {
        log.append($('<li>').text('You stopped touching your deck'));
        rightside.prop('scrollTop', rightside.prop('scrollHeight'));
    });

    // Events
    socket.on('player:connected', function(username) {
        console.log('player:connected', username);
    });
    socket.on('player:disconnected', function(username) {
        console.log('player:disconnected', username);
    });

    socket.on('application:start', function(username) {
        welcomeScreen.hide();
        gameScreen.show();
    });
    socket.on('application:end', function() {
        readyInfo.hide();
        buttonReady.show();
        gameScreen.hide();
        welcomeScreen.show();
    });
}
