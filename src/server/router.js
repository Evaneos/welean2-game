module.exports = {
    app : null,

    load : function(config) {
        if (!this.app) {
            throw new Error('yo no app bitch');
        }

        var route = null;
        for (var i = 0; i < config.routes.length; i++) {
            route = config.routes[i];
            if (route.url.length === 0) {
                route.url = 'index';
            }

            this.app[route.method](route.url, require('./controllers/' + route.controller + '.js'));
        }
    }
};