var User = require('./User');

module.exports = {
    usersCount: 0,
    usersReady: 0,
    users: {},

    init() {
        this.$playersCount = $('.playersCount');
        this.$playersReadyCount = $('.playersReadyCount');
    },

    forEach(callback) {
        S.forEach(this.users, callback);
    },
    getOrCreate(name, ready) {
        var user = this.users[name];
        if (user) {
            user.reconnect();
            return user;
        }
        user = new User(name);
        this.users[name] = user;
        this.usersCount++;
        this.$playersCount.text(this.usersCount);
        if (ready) {
            this.markUserAsReady(user.name);
        }
        return user;
    },
    /**
     * Get a connected user.
     * If the user is disconned, it will not be returned.
     *
     * @param {String} name
     * @return {User}
     */
    getConnected(name) {
        var user = this.users[name];
        if (user && user.isConnected()) {
            return user;
        }
    },
    disconnect(name) {
        var user = this.users[name];
        if (user) {
            user.disconnect(this.delete.bind(this));
        }
    },
    delete(name) {
        var user = this.users[name];
        if (user) {
            if (user.ready) {
                this.usersReady--;
                this.$playersReadyCount.text(this.usersReady);
            }
            user.delete();

            this.usersCount--;
            this.$playersCount.text(this.usersCount);
            delete this.users[name];
        }
    },
    resetAll() {
        S.forEach(this.users, (u) => u.reset());
        this.usersReady = 0;
        this.$playersReadyCount.text(this.usersReady);
    },
    markUserAsReady(name) {
        var user = this.getConnected(name);
        if (user) {
            user.markAsReady();
            this.usersReady++;
            this.$playersReadyCount.text(this.usersReady);
        }
    },
};