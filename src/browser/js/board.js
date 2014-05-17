global.S = require('springbokjs-utils');
document.addEventListener( "DOMContentLoaded", main, false );

function main() {
    try {
    var token = window.token, client = window.client;
    console.log('BOARD');

    var welcomeScreen = $('.welcome');
    var gameScreen = $('.game');

    var usersList = $('#list-users');
    var logList = $('#log'), logListParent = logList.parent();

    var log = function(message) {
        var span = $('<span style="color:gray">').text(new Date().toTimeString().split(' ')[0] + ' ');
        var li = $('<li>').hide().text(message);
        li.prepend(span).appendTo(logList).fadeIn();
        logListParent.prop('scrollTop', logListParent.prop('scrollHeight'));
    };

    var users = {};
    var usersCount = 0;
    var usersReady = 0;
    var User = S.newClass({
        construct(name) {
            this.name = name;
            this.$elt = $('<li/>').text(name);
            usersList.append(this.$elt);
            usersCount++;
            $('.playersCount').text(usersCount);
        },
        remove() {
            this.$elt.css('text-decoration', 'line-through').fadeOut(1000, function() { $(this).remove(); });
            delete this.$elt;
            delete users[this.name];
            usersCount--;
            $('.playersCount').text(usersCount);
            if (this.ready) {
                usersReady--;
                $('.playersReadyCount').text(usersReady);
            }
        },
        markAsReady() {
            this.ready = true;
            $('<span> ✔</span>').appendTo(this.$elt).fadeIn().fadeOut().fadeIn();
            usersReady++;
            $('.playersReadyCount').text(usersReady);
            /*The server should be the one to starts the game
            if (usersReady === usersCount) {
                appReady();
            }*/
        }
    });

    var socket = io.connect('http://localhost');
    global.socket = socket;

    // Join room
    socket.emit('room:join', { token : token, client: client });

    socket.on('initialData', (data) => {
        data.users.forEach((user) => {
            var u = users[name] = new User(user.name);
            if (user.ready) {
                u.markAsReady();
            }
        });
    });

    socket.on('application:start', function() {
        log('Le jeu commence !');
        welcomeScreen.hide();
        gameScreen.show();
    });
    socket.on('application:end', function() {
        usersReady = 0;
        $('.playersReadyCount').text(usersReady);
        gameScreen.hide();
        welcomeScreen.show();
    });

    socket.on('player:connected', function(name) {
        log('Le joueur "' + name + '" nous a rejoint');
        users[name] = new User(name);
    });
    socket.on('player:disconnected', function(name) {
        log('Le joueur "' + name + '" nous a quitté');
        if (users[name]) {
            users[name].remove();
        }
    });
    socket.on('player:ready', function(name) {
        log('Le joueur "' + name + '" est prêt !');
        if (users[name]) {
            users[name].markAsReady();
        }
    });
    }catch(err) {
        console.error(err);
    }
}
