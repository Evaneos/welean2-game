var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
global.S = require('springbokjs-utils');
var generator = require('springbokjs-utils/generator');

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

app.locals.basepath = argv.basepath || '/';

require('./socket.js')(server);

if (!argv.production) {
    console.log('Dev mode');
    app.use(require('connect-livereload')({
        port: argv.livereloadPort
    }));
    ['src', 'node_modules'].forEach((folder) => {
        app.use('/' + folder, express.static(__dirname +'/../../' + folder));
    });
} else {
    console.log('Production mode');
}


var token2app = {};

// Home page, for the roomboard
app.get('/', (req, res) => {
    res.render('roomboard/index', { });
});


// Creation of the game (from the roomboard)
app.post('/:gameKey/create', (req, res) => {
    var gameKey = req.params.gameKey;
    console.log(gameKey);

    var token, i = 0;
    while (!token && token2app[token]) {
        token = generator.randomCode(7);
        if (i++ > 20) {
            return res.json(500, { error: 'Failed to generate token' });
        }
    }

    // Create an Application with a Room, ready to receive sockets
    var app = null;

    token2app[token] = app;
    res.json({ token: token });
});

// From the smartphone
app.get('/play/:token', (req, res) => {
    var user = req.cookies.user;
    if (!user) {
        res.render('device/auth', { });
    } else {
        res.render('device/index', { name: user.name });
    }
});

app.post('/play/:token', (req, res) => {
    var name = req.body && req.body.name;
    if (name) {
        res.cookie('user', { name: name });
    }
    res.redirect(req.path);
});

app.use(express.static(__dirname +'/../../public'));

var port = argv.port || 3000;
server.listen(port, console.log.bind(null, 'Listening on port ' + port));
