var express = require("express");
var passport = require('passport');
var expressSession = require('express-session');
var mongoose = require('mongoose');
var expressSession = require('express-session');
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');
var path = require('path');

var dbUrl = 'mongodb://localhost/pi';
if(process.env.OPENSHIFT_MONGODB_DB_URL) {
    dbUrl = process.env.OPENSHIFT_MONGODB_DB_URL;
}
mongoose.connect(dbUrl);

var app = express();

var hbConfig = {
	extname: '.html',
    layoutsDir: path.join(app.settings.views, ""),
    defaultLayout: "main",
    partialsDir: [
    	'views/partials',
    	'views/admin/partials/',
    	'views/public/partials'
    ],
    helpers: {
    	section: function(name, options) {
    		if(!this._sections) {
    			this._sections = {};
    		}
    		this._sections[name] = options.fn(this);
    		return;
    	}
    }
}

app.engine('html', exphbs(hbConfig));
app.set('view engine', 'html');

app.use(expressSession({secret: 'secureTheBeatsIs'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded());

app.use(express.static('assets'));

 // Using the flash middleware provided by connect-flash to store messages in session
 // and displaying in templates
var flash = require('connect-flash');
app.use(flash());

var publicRoutes = require('./routes/public');
app.use('/', publicRoutes);

var initPassport = require('./passport/init');
initPassport(passport);
var adminRoutes = require('./routes/admin')(passport);
app.use('/admin', adminRoutes);

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send(err);
    console.log(err);
});

app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 3000);
app.listen(app.get('port'), process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0', function() {
  console.log('Express server listening on port ' + app.get('port'));
});
