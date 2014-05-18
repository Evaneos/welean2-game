global.S = require('springbokjs-utils');
document.addEventListener( "DOMContentLoaded", main, false );

var userList = require('./board/userList');
var User = require('./board/User');

var Popup = require('./Popup');



function main() {
    var popup = new Popup();
    try {
        userList.init();
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

    socket.on('application:started', () => {
        log('Le jeu commence !');
        welcomeScreen.hide();
        gameScreen.show();
    });
    socket.on('application:ended', () => {
        log('Le jeu est terminé. Prêt pour une nouvelle partie ?');
        gameScreen.hide();
        welcomeScreen.show();
        userList.resetAll();
    });

    socket.on('player:connected', (name) => {
        log('Le joueur "' + name + '" nous a rejoint');
        userList.getOrCreate(name);
    });
    socket.on('player:disconnected', (name) => {
        log('Le joueur "' + name + '" nous a quitté');
        userList.disconnect(name);
    });
    socket.on('player:left', (name) => {
        log('Le joueur "' + name + '" nous a quitté');
        userList.delete(name);
    });
    socket.on('player:ready', (name) => {
        log('Le joueur "' + name + '" est prêt !');
        userList.markUserAsReady(name);
    });
    socket.on('player:cardPlayed', (data) => {
        log('Le joueur "' + data.userName + '" a joué la carte ' + data.cardId);
        var user = userList.getConnected(data.userName);
        if (user) {
            user.setCard(data.cardId);
        }
    });

    socket.on('round:winner', (data) => {
        log('Winner: ' + data.userName);
        setTimeout(() => {
            popup.display('Winner: ' + data.userName);
        }, 1200);
    });


    socket.on('round:started', (data) => {
        log('Round #' + data.roundNumber + ' avec les joueurs ' + data.userNames.join(', '));
    });

    // hack
    var isRoundCurrentlyBataille = false;

    socket.on('round:ended', (data) => {
        isRoundCurrentlyBataille = false;
        log('Find du round');
        setTimeout(() => {
            if (!isRoundCurrentlyBataille) {
                userList.forEach((user) => {
                    user.removeCard();
                });
                socket.emit('board:ready');
            } else {
                setTimeout(() => {
                    socket.emit('board:ready');
                }, 2000);
            }
        }, 2000);
    });

    socket.on('round:bataille', (data) => {
        isRoundCurrentlyBataille = true;
        log('Bataille entre les joueurs ' + data.userNames.join(', '));


        setTimeout(() => {
            popup.display('Bataille !');
            data.userNames.forEach((name) => {
                var user = userList.getConnected(name);
                user.setCard();
            });
        }, 1500);
    });

    socket.on('game:winner', (data) => {
        log('Game winner: ' + data.userName);
        popup.display('Gagnant : ' + data.userName);
    });

    }catch(err) {
        console.error(err);
    }
}
