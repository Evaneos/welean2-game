global.S = require('springbokjs-utils');
document.addEventListener( "DOMContentLoaded", main, false );

var userList = require('./board/userList');
var User = require('./board/User');
function main() {
    try {
    var token = window.token, client = window.client;
    console.log('BOARD');

    var welcomeScreen = $('.welcome');
    var gameScreen = $('.game');
    var usersList = $('#list-users');
    var cardsContainer = gameScreen.find('.cards');

    User.usersList = usersList;
    User.cardsContainer = cardsContainer;


    var logList = $('#log'), logListParent = logList.parent();

    var log = function(message) {
        var span = $('<span style="color:gray">').text(new Date().toTimeString().split(' ')[0] + ' ');
        var li = $('<li>').hide().text(message);
        li.prepend(span).appendTo(logList).fadeIn();
        logListParent.prop('scrollTop', logListParent.prop('scrollHeight'));
    };


    var waitForNextRound = function() {
        userList.forEach((user) => {
             user.$eltGame.find('.card-container').find('div').remove();
        });

        socket.emit('board:ready');
    };

    var socket = io.connect('/');
    global.socket = socket;

    // Join room
    socket.emit('room:join', { token : token, client: client });

    socket.on('initialData', (data) => {
        data.users.forEach((user) => {
            userList.getOrCreate(user.name, user.ready);
        });
        if (data.started) {
            welcomeScreen.hide();
            gameScreen.show();
            // TODO: state of the board: with cards
        }
    });

    socket.on('application:started', function() {
        log('Le jeu commence !');
        welcomeScreen.hide();
        gameScreen.show();
    });
    socket.on('application:ended', function() {
        log('Le jeu est terminé. Prêt pour une nouvelle partie ?');
        gameScreen.hide();
        welcomeScreen.show();
        userList.resetAll();
    });

    socket.on('player:connected', function(name) {
        log('Le joueur "' + name + '" nous a rejoint');
        userList.getOrCreate(name);
    });
    socket.on('player:disconnected', function(name) {
        log('Le joueur "' + name + '" nous a quitté');
        userList.disconnect(name);
    });
    socket.on('player:left', function(name) {
        log('Le joueur "' + name + '" nous a quitté');
        userList.delete(name);
    });
    socket.on('player:ready', function(name) {
        log('Le joueur "' + name + '" est prêt !');
        userList.markUserAsReady(name);
    });
    socket.on('player:cardPlayed', function(data) {
        log('Le joueur "' + data.userName + '" a joué la carte ' + data.cardId);
        var user = userList.getConnected(data.userName);
        if (user) {
            var card = $(generateCard(data.cardId));

            card.css({
                'top': '1000px'
            });
            user.$eltGame.find('.card-container').append(card);
            card.animate(
                {
                    'top': '0'
                },
                1000
            );
        }
    });

    socket.on('round:winner', function(data) {
        log('Winner: ' + data.userName);
        window.setTimeout(waitForNextRound, 2000);
    });
    socket.on('round:started', function(data) {
        log('Round #' + data.roundNumber + ' avec les joueurs ' + data.playersNames.join(', '));
    });


    var generateCard = function(id, face = true) {
        var cssClass = 'sprite-deck-' + (face ? id : 'backside');
        return '<div class="icon-big ' + cssClass + '"></div>';
    };

    }catch(err) {
        console.error(err);
    }
}
