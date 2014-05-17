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

        app.on('started', () => {
            console.log('STARTED!!!!!!!!!!');
            this.emitToAll('application:started');
        });
        app.on('ended', () => {
            console.log('ENDED!!!!!!!!!!');
            this.emitToAll('application:ended');
        });
    },

    emitToMainBoards(event, data) {
        console.log('emitToMainBoardsServer', event, data);
        this.mainboards.forEach((mainboard) => mainboard.emitClient(event, data));
    },
    emitToUsers(event, data) {
        this.users.forEach((user) => user.emitClient(event, data));
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
        console.log('add mainboard');
        this.mainboards.push(socket);
    },
    removeMainboard(socket) {
        console.log('remove mainboard');
        S.array.remove(this.mainboards, socket);
        //this.app.pause();
    },
    createUser(socketUser, name) {
        console.log('add user');
        this.users.push(socketUser);
        var user = this.app.join(name);
        this.emitToMainBoards('player:connected', name);
        this.emitToUsers('player:connected', name);
        return user;
    },
    removeUser(user) {
        console.log('remove user');
        S.array.remove(this.users, user);
        this.app.quit(user) ;
        this.emitToMainBoards('player:disconnected', user.name);
        this.emitToUsers('player:disconnected', user.name);
        if (this.mainboards.length === 0 && this.users.length === 0) {
            this.delete();
        }
    },
    userEvent(user, event, data) {
        if (event === 'ready') {
            console.log(this.users.some((u) => {
                console.log(u);
                console.log(u.name, u.isReady(), u.user.state);
                return !u.isReady();
            }));
            if (!this.users.some((u) => !u.isReady())) {
                this.app.tryToStart();
            }
        }
        console.log('userEvent', user.name, event, data);
        this.emit('player:' + event, user.name);
    },
    delete() {
        console.log('delete app ' + this.token);
        delete applicationsMap[this.token];
        this.app.delete();
    }
});