var LocalStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
var PiDAO = require('../persistence/PiDAO');

module.exports = function(passport) {
	passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, email, password, done) {
	        console.info('begin login');


            email = email.toLowerCase();
            var staffUser;

            PiDAO.getStaffUserByEmail(email)
                .then(function(result) {
                    console.info('finished getstaffuserbyemail query');


                    staffUser = result[0];

                    if (!staffUser) {
                        console.info('could not find staff user');
                    }
                    if (!staffUser || !isValidPassword(password, staffUser)) {
                        console.info('either staff user not found or password is invalid');

                        done(null, false, req.flash('errorMessage', 'Incorrect email or password'));
                    } else {
                        console.info('found staff user and password is valid');

                        staffUser.resetToken = undefined;
                        staffUser.resetTokenExpiration = undefined;
                        return PiDAO.updateStaffUser(staffUser)
                            .then(function() {
                                console.info('successfully updated staff user');
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