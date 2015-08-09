var express = require('express');
var path = require('path');
var moment = require('moment');
var AdminUser = require('../persistence/models/adminUser');
var Auditionee = require('../persistence/models/auditionee');
var utils = require('../common/utils')

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated()) {
		return next();
	}	
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/admin/login');
}

module.exports = function(passport) {
	var router = express.Router();

	router.get('/login', function(req, res) {
		res.render('admin/login', { authMessage: req.flash('authMessage') });
	});

	router.post('/login', passport.authenticate('login', {
		successRedirect: '/admin',
		failureRedirect: '/admin/login',
		failureFlash : true
	}));

	router.get('/', isAuthenticated, function(req, res) {
		res.render('admin/home');
	});

	router.get('/auditionees', isAuthenticated, function(req, res) {
		Auditionee.find(function(err, auditionees) {
			if (err) {
				console.error(err);
			}
			res.render('admin/auditionees', {auditionees: auditionees});
		});
	});

	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/admin');
	});

	router.get('/users', function(req, res) {
		AdminUser.find(function(err, adminusers) {
			if (err) {
				console.error(err);
			}
			res.render('admin/users', {adminusers: adminusers});
		});
	});

	router.get('/users/new', function(req, res) {
		res.render('admin/newUser');
	});

	router.post('/users/new', function(req, res) {
		var token = require('crypto').randomBytes(32).toString('hex');
		
		AdminUser.findOne({ 'email': req.body.email }, function (err, user) {
			if(user) {
				console.info("New User: user already exists with email, %s", req.body.email);
				res.render('admin/newUserExists');				
			} else {				
				console.info("New User: no user found for email, %s ... adding user with token.", req.body.email);
				var adminUser = new AdminUser();
				adminUser.firstName = req.body.firstName;
				adminUser.lastName = req.body.lastName;
				adminUser.email = req.body.email;
				adminUser.token = utils.createHash(token);
				adminUser.tokenExpires = moment().add(1, 'hours');
				adminUser.save(function(err) {
					if (err) {
						res.send(err);
					}
					
					res.render('admin/newUserSuccess');
				});
			}
		});		
	});

	// router.post('/users', function(req, res) {
	// 	var adminUser = new AdminUser();
	// 	adminUser.firstName = req.body.firstName;
	// 	adminUser.lastName = req.body.lastName;
	// 	adminUser.email = req.body.email;
	// 	adminUser.password = utils.createHash(req.body.password);

	// 	adminUser.save(function(err) {
	// 		if (err) {
	// 			res.send(err);
	// 		}
	// 		res.json({ message: 'User created!' });
	// 	});		
	// });

	// router.get('/users', function(req, res) {
	// 	AdminUser.find(function(err, adminUsers) {
	// 		if (err) {
	// 			res.send(err);
	// 		}
	// 		res.json(adminUsers);
	// 	});
	// });

	// router.put('/users/:user_id', function(req, res) {
	// 	AdminUser.findById(req.params.user_id, function(err, user) {
	// 		if (err) {
	// 			res.send(err);
	// 		}
	// 		user.firstName = req.body.firstName;
	// 		user.lastName = req.body.lastName;
	// 		user.email = req.body.email;
	// 		user.password = utils.createHash(req.body.password);
	// 		user.save(function(err) {
	// 			if (err) {
	// 				res.send(err);
	// 			}
	// 			res.json({ message: 'user updated!' });
	// 		});
	// 	});
	// });

	// router.delete('/users/:user_id', function(req, res) {
	// 	AdminUser.remove({
	// 		_id: req.params.user_id
	// 	}, function(err, bear) {
	// 		if (err) {
	// 			res.send(err);
	// 		}
	// 		res.json({ message: 'Successfully deleted user' });
	// 	});
	// });    

	return router;
}

