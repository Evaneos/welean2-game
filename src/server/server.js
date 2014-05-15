var express = require('express');
var app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

var argv = require('minimist')(process.argv.slice(2), {
    alias: {
        'production': 'prod'
    }
});

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

app.get('*', (req, res) => res.render('index', { basepath: argv.basepath || '/', URL: req.path }));

app.use(express.static(__dirname +'/../../public'));

app.listen(3000);