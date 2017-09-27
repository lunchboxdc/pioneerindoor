var login = require('./login');
var PiDAO = require('../persistence/PiDAO');

module.exports = function(passport) {

	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        PiDAO.getStaffUserById(id)
            .then(function(staffUser) {
                done(null, staffUser[0]);
            })
            .catch(function(e) {
                done(e);
            });
    });

    login(passport);
};