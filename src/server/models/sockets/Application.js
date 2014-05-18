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
            this.users.forEach((u) => u.markAsIdle());
            process.nextTick(() => {
                this.emitToAll('application:ended');
            });
        });
        app.on('roundWinner', (winner) => {
            this.emitToUsersExcept(winner.name, 'round:lost', (user) => {
                return { hand: user.user.hand.length };
            });
            this.emitToUser(winner.name, 'round:won');
            this.emitToMainBoards('round:winner', { userName: winner.name });
        });

        app.on('roundEnded', () => {
            this.emitToMainBoards('round:ended', {});
        });

        app.on('roundStarted', (roundNumber, players) => {
            var names = players.map((u) => u.name);
            this.mainboards.forEach((mainboard) => {
                mainboard.once('ready', () => {
                    if (this.areMainboardsReady()) {
                        this.emitToUsersFiltredByNames(names, 'round:started');
                    }
                });
            });
            this.emitToMainBoards('round:started', { roundNumber: roundNumber, userNames: names });
        });
        app.on('bataille', (filteredWinners) => {
            var names = filteredWinners.map((u) => u.name);

            this.emitToUsersExcept(names, 'round:lost', (user) => {
                return { hand: user.user.hand.length };
            });
            this.emitToUsersFiltredByNames(names, 'bataille');
            this.emitToMainBoards('round:bataille', { userNames: names });
        });
        app.on('gameWinner', (winner) => {
            this.emitToUsersExcept(winner.name, 'game:lost');
            this.emitToUser(winner.name, 'game:won');
            this.emitToMainBoards('game:winner', { userName: winner.name });
        });
    },

    areMainboardsReady() {
        return !this.mainboards.some((mb) => !mb.isReady());
    },

    emitToMainBoards(event, data) {
        logger.debug('emitToMainBoardsServer ' + event + ' ' + require('util').inspect(data));
        this.mainboards.forEach((mainboard) => mainboard.emitClient(event, data));
    },
    emitToUsers(event, data) {
        this._emitToUsers(this.users, event, data);
    },
    emitToUsersExcept(names, event, data) {
        if (!S.isArray(names)) {
            names = [names];
        }
        this._emitToUsers(this.users.filter((u) => !S.array.has(names, u.name)), event, data);
    },
    emitToUsersFiltredByNames(names, event, data) {
        this._emitToUsers(this.users.filter((u) => S.array.has(names, u.name)), event, data);
    },
    emitToUser(name, event, data) {
        this._emitToUser(this.usersMap[name], event, data);
    },
    _emitToUsers(users, event, data) {
        logger.debug('_emitToUsers (' + users.length + ')' + event + ' ' + require('util').inspect(data));
        users.forEach((user) => {
            this._emitToUser(user, event, data);
        });
    },
    _emitToUser(user, event, data) {
        if (!user.user) {
            throw new Error();
        }
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
            started: this.app.started,
            users: this.users.map((user) => {
                return { name: user.name, ready: user.isReady() };
            }),
            usersReadyCount: this.app.usersReadyCount
        };
    },

    addMainboard(socket) {
        logger.debug('add mainboard');
        this.mainboards.push(socket);
        this.clearDeleteTimeout();
    },
    removeMainboard(mainboard) {
        logger.debug('remove mainboard');
        S.array.remove(this.mainboards, mainboard);
        if (!mainboard.isReady()) {
            mainboard.emit('ready');//prevent application for beeing lost
        }
        mainboard.removeAllListeners();
        // This should be paused, but the fonctionnality is not yet implemented
        //this.app.pause();
        if (this.mainboards.length === 0 && this.users.length === 0) {
            this.delete();
        }
    },
    createUser(socketUser, name) {
        logger.debug('add user');
        var user = this.app.join(name);
        this.usersMap[name] = socketUser;
        this.emitToMainBoards('player:connected', name);
        this.emitToUsers('player:connected', name);
        this.users.push(socketUser);
        this.clearDeleteTimeout();
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
        } else {
            if (this.app.started) {
                this.app.end();
            }
        }
        this.deleteIfEmpty();
    },
    userEvent(user, event, data) {
        console.log('userEvent', user.name, event, data);
        this.emitToMainBoards('player:' + event, user.name);
        if (event === 'ready') {
            if (!this.users.some((u) => !u.isReady())) {
                this.app.tryToStart();
            }
        }
    },
    delete() {
        logger.debug('delete app ' + this.token);
        delete applicationsMap[this.token];
        this.app.delete();
    },
    deleteIfEmpty() {
        if (this.mainboards.length === 0 && this.users.length === 0) {
            this.delete();
        }
    },
    deleteMaybeLater() {
        this.timeoutIdDelete = setTimeout(this.deleteIfEmpty.bind(this), 10000);
    },
    clearDeleteTimeout() {
        if (this.timeoutIdDelete) {
            clearTimeout(this.timeoutIdDelete);
            this.timeoutIdDelete = null;
        }
    }
});