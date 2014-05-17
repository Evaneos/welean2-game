var Application = S.extendClass(require('events').EventEmitter);
module.exports = Application;
var token2app = require('../../token.js');

var applicationsMap = {};

Application.getOrCreate = function(token) {
    if (applicationsMap[token]) {
        return applicationsMap[token];
    }
    var app = token2app[token];
    if (!app) {
        throw new Error('app was not found from token');
    }
    return applicationsMap[token] = new Application(app);
};

Application.extendPrototype({
    construct(app) {
        this.token = app.token;
        applicationsMap[app.token] = app;
        this.app = app;
        this.mainboards = [];
        this.users = [];
        this.usersMap = {};

        app.on('started', () => {
            setTimeout(() => {
                this.emitToAll('application:started');
            });
        });
        app.on('ended', () => {
            process.nextTick(() => {
                this.emitToAll('application:ended');
            });
        });
        app.on('roundWinner', (winner) => {
            setTimeout(() => {
                this.emitToUsersExcept(winner, 'round:lost', (u) => {
                    return { hand: u.user.hand.length };
                });
                this._emitToUser(this.usersMap[winner.name], 'round:won');
                this.emitToMainBoards('round:winner', { userName: winner.name });
            });
        });

        app.on('roundStarted', (roundNumber, players) => {
            var names = players.map((u) => u.name);
            setTimeout(() => {
                this.emitToMainBoards('round:started', { roundNumber: roundNumber, playersNames: names });
                this.emitToUsersFiltredByNames(names, 'round:started');
            });
        });
        app.on('gameWinner', (winners) => {
            setTimeout(() => {
            });
        });
    },

    emitToMainBoards(event, data) {
        logger.debug('emitToMainBoardsServer ' + event + ' ' + require('util').inspect(data));
        this.mainboards.forEach((mainboard) => mainboard.emitClient(event, data));
    },
    emitToUsers(event, data) {
        this._emitToUsers(this.users, event, data);
    },
    emitToUsersExcept(user, event, data) {
        this._emitToUsers(this.users.filter((u) => u.name !== user.name), event, data);
    },
    emitToUsersFiltredByNames(names, event, data) {
        this._emitToUsers(this.users.filter((u) => S.array.has(names, u.name)), event, data);
    },
    _emitToUsers(users, event, data) {
        logger.debug('_emitToUsers (' + users.length + ')' + event + ' ' + require('util').inspect(data));
        users.forEach((user) => {
            this._emitToUser(user, event, data);
        });
    },
    _emitToUser(user, event, data) {
        var userData = data;
        if (S.isFunction(userData)) {
            userData = userData(user);
        } else if (!userData) {
            userData = {};
        }
        userData.userName = user.name;
        user.emitClient(event, userData);
    },
    emitToAll(event, data)  {
        this.emitToMainBoards(event, data);
        this.emitToUsers(event, data);
    },

    initialData() {
        return {
            users: this.users.map((user) => {
                return { name: user.name, ready: user.isReady() };
            }),
            usersReadyCount: this.app.usersReadyCount
        };
    },

    addMainboard(socket) {
        logger.debug('add mainboard');
        this.mainboards.push(socket);
    },
    removeMainboard(socket) {
        logger.debug('remove mainboard');
        S.array.remove(this.mainboards, socket);
        //this.app.pause();
    },
    createUser(socketUser, name) {
        logger.debug('add user');
        var user = this.app.join(name);
        this.users.push(socketUser);
        this.usersMap[name] = socketUser;
        this.emitToMainBoards('player:connected', name);
        this.emitToUsers('player:connected', name);
        return user;
    },
    removeUser(user) {
        logger.debug('remove user');
        S.array.remove(this.users, user);
        delete this.usersMap[user.name];
        this.app.quit(user) ;
        this.emitToMainBoards('player:disconnected', user.name);
        this.emitToUsers('player:disconnected', user.name);
        if (this.mainboards.length === 0 && this.users.length === 0) {
            this.delete();
        }
    },
    userEvent(user, event, data) {
        if (event === 'ready') {
            if (!this.users.some((u) => !u.isReady())) {
                this.app.tryToStart();
            }
        }
        console.log('userEvent', user.name, event, data);
        this.emit('player:' + event, user.name);
    },
    delete() {
        logger.debug('delete app ' + this.token);
        delete applicationsMap[this.token];
        this.app.delete();
    }
});