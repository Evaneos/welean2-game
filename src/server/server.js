require('springbokjs-shim/es6');
global.S = require('springbokjs-utils');
var ConsoleLogger = require('springbokjs-logger/console');
global.logger = new ConsoleLogger();

var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');
var generator = require('springbokjs-utils/generator');


var argv = require('minimist')(process.argv.slice(2), {
    alias: {
        'production': 'prod'
    }
});

process.on('uncaughtException',function(err){
    console.error(err.stack);
});

var app = express();


var server = require('http').createServer(app);

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(cookieParser(argv.production ? generator.randomCode(12) : undefined));
app.use(bodyParser.urlencoded());

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

var router = require('./router.js');
router.app = app;
router.load(require('./config/route.js'));


app.locals.basepath = argv.basepath || '/';

require('./socket')(argv);


app.use(express.static(__dirname +'/../../public'));

var port = argv.port || 3000;
server.listen(port, console.log.bind(null, 'Listening on port ' + port));
