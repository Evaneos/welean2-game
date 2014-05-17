require('springbokjs-shim/es6');
global.S = require('springbokjs-utils');

var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');
var generator = require('springbokjs-utils/generator');

var SocketApplication = require('./models/sockets/Application');
var SocketUser = require('./models/sockets/User');
var SocketMainboard = require('./models/sockets/Mainboard');


var argv = require('minimist')(process.argv.slice(2), {
    alias: {
        'production': 'prod'
    }
});

var app = express();


var server = require('http').createServer(app);

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(cookieParser(argv.production ? generator.randomCode(12) : undefined));
app.use(bodyParser.urlencoded());

var router = require('./router.js');
router.app = app;
router.load(require('./config/route.js'));


app.locals.basepath = argv.basepath || '/';

require('./socket')(server, function(io) {
    io.sockets.on('connection', function(socket) {
        socket.on('room:join', function(data) {
            var game = SocketApplication.getOrCreate(data.token);
            if (!game) {
                throw new Error("Impossible de créer l'application");
            }
            //TODO factory in SocketApplication

            try {
                if (data.client == 'board') {
                    new SocketMainboard(game, socket, data);
                } else if (data.client == 'device') {
                    new SocketUser(game, socket, data);
                }
            } catch(e) {
                console.error(e.stack || e.message);
            }
        });
    });
});

if (!argv.production) {
    console.log('Dev mode');
    app.use(require('connect-livereload')({
        port: argv.livereloadPort
    }));
    ['src', 'node_modules'].forEach((folder) => {
        app.use('/' + folder, express.static(path.normalize(__dirname +'/../../' + folder)));
    });
} else {
    console.log('Production mode');
}

app.use(express.static(__dirname +'/../../public'));

var port = argv.port || 3000;
server.listen(port, console.log.bind(null, 'Listening on port ' + port));
