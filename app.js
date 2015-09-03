require('./common/logger');
var appConfig = require('./common/appConfig');
var express = require("express");
var passport = require('passport');
var mongoose = require('mongoose');
var expressSession = require('express-session');
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');
var path = require('path');
var favicon = require('serve-favicon');

var mongooseConnected = false;
mongoose.connect('mongodb://localhost/pi');
mongoose.connection.on("connected", function(ref) {
    mongooseConnected = true;
});    

var app = express();
app.set('view engine', 'html');

var hbs = exphbs.create({
	extname: '.html',
    layoutsDir: path.join(app.settings.views, ""),
    defaultLayout: "main",
    partialsDir: [
    	'./views/partials',
    	'./views/admin/partials/',
    	'./views/public/partials'
    ],
    helpers: {
    	section: function(name, options) {
    		if(!this._sections) {
    			this._sections = {};
    		}
    		this._sections[name] = options.fn(this);
    		return;
    	},
        equals: function(a, b, options) {
            if (a === b) {
                return options.fn(this);
            }
            else {
                return options.inverse(this);
            }
        }
    }
});

app.engine('html', hbs.engine);

//middleware and other components specific to either prod or non-prod
if(process.env.NODE_ENV !== 'prod') {
    //run facebook stuff once locally at startup
    //require('./common/script/runFacebookService');
    //not behind nginx locally so lets serve out assets through node
    app.use('/assets', express.static('assets'));
} else {
    //run scheduler in prod
    require('./common/scheduler');
}

app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: 'secureTheBeatsIs'
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: false }));

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

var apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

app.use(favicon(__dirname + '/assets/image/favicon/favicon.ico'));

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send(err);
    console.error(err);
});

var port = (appConfig.port || 3000);
var ip = '0.0.0.0';
app.listen(port, ip, function() {
    console.info('Pioneer Indoor app running at http://%s:%s', ip, port);
});

process.on('SIGINT', function() {  
  mongoose.connection.close(function () { 
    console.log('Mongoose default connection disconnected through app termination'); 
    process.exit(0); 
  }); 
});