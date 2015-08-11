var express = require('express');
var path = require('path');
var moment = require('moment');
var piMailer = require('../email/piMailer');
var AdminUser = require('../persistence/models/adminUser');
var Auditionee = require('../persistence/models/auditionee');
var utils = require('../common/utils');

module.exports = (function() {
	var router = express.Router();

	router.get('/', function(req, res) {
		res.render('admin/home');
	});

	router.get('/auditionees', function(req, res) {
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
			var payLoad = {adminusers: adminusers};
			var usersMessage = req.flash('usersMessage');
			if(usersMessage.length>0 && usersMessage[0].length>0) {
				payLoad['usersMessage'] = usersMessage[0];
			}
			res.render('admin/users', payLoad);
		});
	});

	router.get('/users/new', function(req, res) {
		res.render('admin/newUser');
	});

	router.post('/users/new', function(req, res) {

		AdminUser.findOne({ 'email': req.body.email }, function (err, user) {
			if(user) {
				console.info("New User: user already exists with email, %s", req.body.email);
				res.render('admin/newUserExists');
			} else {
				console.info("New User: no user found for email, %s ... adding user with token.", req.body.email);
				var token = require('crypto').randomBytes(32).toString('hex');
				var adminUser = new AdminUser();
				adminUser.firstName = req.body.firstName;
				adminUser.lastName = req.body.lastName;
				adminUser.email = req.body.email;
				adminUser.token = utils.createHash(token);
				adminUser.tokenExpires = moment().add(1, 'hours');
				adminUser.save(function(err, user) {
					if (err) {
						console.error('error adding user: ' + user);
						req.flash('usersMessage', 'error adding user!');
					}
					piMailer.emailNewAdmin(user.firstName, user.email, token, user._id);
					res.render('admin/newUserSuccess');
				});
			}
		});
	});

	router.post('/users/delete', function(req, res) {
		if(req.body.userId === req.user._id.toString()) {
			console.log("you can't delete the user you're logged in with!");
			req.flash('usersMessage', 'you can\'t delete the user you\'re logged in with!');
			res.redirect('/admin/users');
		} else {
			AdminUser.remove({
				_id: req.body.userId
			}, function(err, user) {
				if (err) {
					console.error('error deleting user: ' + user);
					req.flash('usersMessage', 'error deleting user!');
				} else {
					req.flash('usersMessage', 'Successfully deleted user');
				}
				res.redirect('/admin/users');
			});
		}
	});

	return router;
})();