require('./common/logger');
var appConfig = require('./common/appConfig');
var express = require('express');
var passport = require('passport');
var ConnectionManager = require('./persistence/ConnectionManager');
var AssetsVersion = require('./persistence/AssetsVersion');
var expressSession = require('express-session');
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');
var path = require('path');
var favicon = require('serve-favicon');


function exitApp() {
    ConnectionManager.close();
    console.info('Pioneer Indoor app stopped');
    process.exit();
}

if (!process.env.PI_SESSION_SECRET) {
    console.info('PI_SESSION_SECRET -> ' + process.env.PI_SESSION_SECRET);
    console.error('Missing PI_SESSION_SECRET environment variable');
    exitApp();
}


ConnectionManager.open();


var expressSessionConfig = {
    resave: false,
    saveUninitialized: false,
    secret: process.env.PI_SESSION_SECRET
};

if (process.env.NODE_ENV === 'prod') {
    var redis = require("redis");
    var redisStore = require('connect-redis')(expressSession);
    var client = redis.createClient();

    expressSessionConfig['store'] = new redisStore({ host: 'localhost', port: 6379, client: client, ttl: 260});
}


var app = express();
app.set('view engine', 'html');

app.use(expressSession());

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: false }));

var hbs = exphbs.create({
	extname: '.html',
    layoutsDir: path.join(app.settings.views, ""),
    defaultLayout: "main",
    partialsDir: [
    	'./views/partials',
    	'./views/admin/partials',
    	'./views/public/partials',
        './email/templates'
    ],
    helpers: require('./common/HandlebarsHelpers')
});

app.engine('html', hbs.engine);

//middleware and other components specific to either prod or non-prod
if (process.env.NODE_ENV !== 'prod') {
    //run facebook stuff once locally at startup
    //require('./common/script/runFacebookService');
    //not behind nginx locally so lets serve out assets through node
    app.use('/assets', express.static('assets'));
}


//temporary middleware to parse raw body on post requests
//app.use(function(req, res, next) {
//    var data = '';
//    req.setEncoding('utf8');
//    req.on('data', function(chunk) {
//        data += chunk;
//    });
//    req.on('end', function() {
//        req.rawBody = data;
//    });
//    next();
//});

var flash = require('connect-flash');
app.use(flash());

var publicRoutes = require('./routes/public')(passport);
app.use('/', publicRoutes);

var initPassport = require('./passport/init');
initPassport(passport);
var adminRoutes = require('./routes/admin');
app.use('/admin', function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}, adminRoutes);

// var apiRoutes = require('./routes/api');
// app.use('/api', apiRoutes);

app.use(favicon(__dirname + '/assets/image/favicon/favicon.ico'));

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send(err);
    console.error(err);
});

var port = (appConfig.port || 3000);
var ip = '0.0.0.0';

process.on('SIGINT', function() {
    exitApp();
});

AssetsVersion.updateAssetsVersion()
    .then(function() {
        app.listen(port, ip, function() {
            console.info('Pioneer Indoor app running at http://%s:%s using node %s', ip, port, process.version);
        });
    })
    .catch(function(e) {
        console.error('Error starting app: ' + e);
        exitApp();
    });