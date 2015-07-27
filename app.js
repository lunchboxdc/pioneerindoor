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

app.set('port', process.env.PORT || 8080);
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

app.listen(app.get('port'), '127.0.0.1', function() {
  console.log('Express server listening on port ' + app.get('port'));
});