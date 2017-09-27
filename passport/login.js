var LocalStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
var PiDAO = require('../persistence/PiDAO');

module.exports = function(passport) {
	passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, email, password, done) {
            email = email.toLowerCase();
            var staffUser;

            PiDAO.getStaffUserByEmail(email)
                .then(function(result) {
                    staffUser = result[0];
                    if (!staffUser || !isValidPassword(password, staffUser)) {
                        done(null, false, req.flash('errorMessage', 'Incorrect email or password'));
                    } else {
                        staffUser.resetToken = undefined;
                        staffUser.resetTokenExpiration = undefined;
                        return PiDAO.updateStaffUser(staffUser)
                            .then(function() {
                                done(null, staffUser);
                            });
                    }
                })
                .catch(function(e) {
                    console.error('Error on login.', e);
                    done(null, false, req.flash('errorMessage', 'An unexpected error has occurred. Please contact the system admin.'));
                });
        })
    );

    var isValidPassword = function(password, user) {
        return bCrypt.compareSync(password, user.password);
    }
};