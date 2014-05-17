var gulp = require('gulp');
var pkg = require('./package.json');
require('springbokjs-base/gulptask.js')(pkg, gulp, {
    paths: {
        browser: {
            mainscripts: [
                'js/board.js',
                'js/device.js',
            ]
        }
    },
    src: {
        css: [
            // here put css files from bower or node_modules or other assets,
            // included before the main less file in src/browser/less/main.less.
        ],
        js: {
            'js/board.js': [
                // here put js files from bower or node_modules or other assets,
                // included before files from src/browser/js/ folder.
                'node_modules/springbokjs-shim/init.js',
                'bower_components/jquery/dist/jquery.min.js',
                //'node_modules/ejs/ejs.min.js'
            ],
            'js/device.js': [
                'node_modules/springbokjs-shim/init.js',
                'bower_components/jquery/dist/jquery.min.js',
                //'node_modules/ejs/ejs.min.js'
            ]
        }
    },
    jshintBrowserOptions: {
        "predef": [ "S", 'io', '$' ]
    },
    jshintServerOptions: {
        "predef": [ "S", 'logger' ]
    },
});


