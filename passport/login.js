var LocalStrategy = require('passport-local').Strategy;
var AdminUser = require('../persistence/models/adminUser');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport) {
	passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, email, password, done) {
            email = email.toLowerCase();
            AdminUser.findOne({'email':  email}, function(err, user) {
                    if (err) {
                        return done(err);
                    }

                    if (!user || !isValidPassword(password, user)) {
                        return done(null, false, req.flash('errorMessage', 'Incorrect email or password'));
                    }

                    user.tokenExpires = undefined;
                    user.token = undefined;
                    user.save(function (err, user) {
                        if (err) {
                            console.error("Error clearing token properties from user object on login: "+user.email);
                        }
                        return done(null, user);
                    });
                }
            );

        })
    );

    var isValidPassword = function(password, user) {
        return bCrypt.compareSync(password, user.password);
    }
};