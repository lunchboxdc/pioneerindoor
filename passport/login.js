var thisIsPioneer=true;
var LocalStrategy = require('passport-local').Strategy;
var AdminUser = require('../persistence/models/adminUser');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport) {
	passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, email, password, done) { 
            AdminUser.findOne({'email':  email},
                function(err, user) {
                    if (err) {
                        return done(err);
                    }

                    if (!user || !isValidPassword(user, password)) {
                        return done(null, false, req.flash('authMessage', 'Incorrect email or password'));
                    }
                    return done(null, user);
                }
            );

        })
    );

    var isValidPassword = function(user, password) {
        return bCrypt.compareSync(password, user.password);
    }
}