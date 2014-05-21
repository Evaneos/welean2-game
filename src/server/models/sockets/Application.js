var Application = S.extendClass(require('events').EventEmitter);
module.exports = Application;
var token2app = require('../../token.js');

var SocketUser = require('./User');
var SocketMainboard = require('./Mainboard');

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

Application.defineProperty('states', Object.freeze({
    STOPPED: 'ended', //welcome screen
    STARTED: 'started',
    PAUSED: 'paused',
}));

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
                this.changeState(Application.states.STOPPED);
            });
        });
        app.on('roundWinner', (winner) => {
            this.emitToUsersExcept(winner.name, 'round:lost', (user) => {
                return { hand: user.user.hand.length };
            });
            this.emitToUser(winner.name, 'round:won', { hand: winner.hand.length });
            this.emitToMainBoards('round:winner', {
                userName: winner.name
            });
        });

        app.on('roundEnded', () => {
            setTimeout(() => {
                this.emitToMainBoards('round:ended', {
                    playersHand: S.map(this.usersMap, (user) => {
                        return user.user.hand.length;
                    })
                });
            })
        });

        app.on('allPlayersPlayed', () => {
            setTimeout(() => {
                this.app.endRound();
            });
        });

        app.on('roundFinalized', (fn) => {
            fn();
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

    changeState(state) {
        this.state = state;
        this.emitToAll('application:' + this.state);
    },
    isStarted() {
        return this.state === Application.states.STARTED;
    },
    isPaused() {
        return this.state === Application.states.PAUSED;
    },

    tryToUnpause() {
        if (!this.users.some((u) => !u.isConnected())) {
            this.emitToAll('application:unpaused');
            this.state = Application.states.STARTED;
        }
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

    addClient(socket, data) {
        this.clearDeleteTimeout();
        if (data.client == 'board') {
            var mainboard = new SocketMainboard(this, socket, data);
            this.addMainboard(mainboard);
        } else if (data.client == 'device') {
            var existingUser = this.usersMap[data.name];
            if (existingUser) {
                console.log(existingUser);
                if (existingUser.isConnected()) {
                    throw new Error('User already exists in this game');
                }
                existingUser.reconnect(socket);
            } else {
                var user = new SocketUser(this, socket, data);
                this.addUser(user);
            }
        }
    },

    addMainboard(socket) {
        logger.debug('add mainboard');
        this.mainboards.push(socket);
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
    addUser(socketUser) {
        var name = socketUser.name;
        logger.debug('add user ' + name);
        socketUser.user = this.app.join(name);
        this.usersMap[name] = socketUser;
        this.emitToMainBoards('player:connected', name);
        this.emitToUsers('player:connected', name);
        this.users.push(socketUser);
    },
    removeUser(user) {
        logger.debug('remove user');
        S.array.remove(this.users, user);
        delete this.usersMap[user.name];
        this.app.quit(user) ;
        this.emitToMainBoards('player:left', user.name);
        this.emitToUsers('player:left', user.name);
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
            if (this.users.length >= this.app.room.usersMin && !this.users.some((u) => !u.isReady())) {
                this.changeState(Application.states.STARTED);
                this.app.tryToStart();
            }
        } else if (event === 'disconnected') {
            this.changeState(Application.states.PAUSED);
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