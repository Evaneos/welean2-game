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

    addMainboard(socket) {
        console.log('add mainboard');
        this.mainboards.push(socket);
    },
    removeMainboard(socket) {
        console.log('remove mainboard');
        S.array.remove(this.mainboards, socket);
        //this.app.pause();
    },
    addUser(user) {
        console.log('add user');
        this.users.push(user);
        this.app.join(user);
        this.emitToMainBoards('player:connected', user.name);
        this.emitToUsers('player:connected', user.name);
    },
    removeUser(user) {
        console.log('remove user');
        S.array.remove(this.users, user);
        this.app.quit(user);
        this.emitToMainBoards('player:disconnected', user.name);
        this.emitToUsers('player:disconnected', user.name);
        if (this.mainboards.length === 0 && this.users.length === 0) {
            this.delete();
        }
    },
    userEvent(user, event, data) {
        if (event === 'ready') {
            if (!this.users.some((u) => !u.isReady())) {
                this.app.start();
                this.emitToAll('application:started');
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