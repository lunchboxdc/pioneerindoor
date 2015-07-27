var login = require('./login');
var AdminUser = require('../persistence/models/adminUser');

module.exports = function(passport){

	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        AdminUser.findById(id, function(err, user) {
            done(err, user);
        });
    });

    login(passport);
}