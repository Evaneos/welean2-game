module.exports = {
    run: function(token, client) {
        console.log('BOARD');
        var usersList = $('#list-users');

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
                this.$elt.remove();
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

        socket.on('application:start', function() {
            // Game start
            $('.infosPlayersReady').hide();
            window.alert('The game starts !');
        });
        socket.on('application:end', function() {
            usersReady = 0;
            $('.playersReadyCount').text(usersReady);
            $('.infosPlayersReady').show();
        });

        socket.on('player:connected', function(name) {
            console.log('player:connected', name);
            users[name] = new User(name);
        });
        socket.on('player:disconnected', function(name) {
            console.log('player:disconnected', name);
            if (users[name]) {
                users[name].remove();
            }
        });
        socket.on('player:ready', function(name) {
            console.log('player:ready', name);
            if (users[name]) {
                users[name].markAsReady();
            }
        });
    }
};
