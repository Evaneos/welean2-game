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
}

Application.extendPrototype({
    construct(app) {
        applicationsMap[app.token] = app;
        this.app = app;
        this.mainboards = [];
        this.users = [];
    },

    addMainboard(socket) {
        this.mainboards.push(socket);
    },
    removeMainboard(socket) {
        S.array.remove(this.mainboards, socket);
        this.app.pause();
    },
    addUser(user) {
        this.users.push(user);
        this.app.join(user);
    },
    removeUser(user) {
        S.array.remove(this.users, user);
        this.app.join(quit);
    }
});