var express = require('express');
var path = require('path');
var moment = require('moment');
var _ = require('lodash');
var piMailer = require('../email/piMailer');
var AdminUser = require('../persistence/models/adminUser');
var Auditionee = require('../persistence/models/auditionee');
var utils = require('../common/utils');
var csv = require('fast-csv');
var fs = require('fs');

module.exports = (function() {
	var router = express.Router();

	router.get('/', function(req, res) {
		res.render('admin/home');
	});

	router.get('/auditionees', function(req, res) {
		Auditionee.find({})
		.sort({submitDate:'asc'})
		.exec(function(err, auditionees) {
			if (err) {
				console.error(err);
			}
			var payLoad = _.merge({
				auditionees: auditionees,
				auditioneesString: JSON.stringify(auditionees)
			}, req.flash());
			res.render('admin/auditionees', payLoad);
		});
	});

	router.get('/auditionees/export', function(req, res) {
		Auditionee.find({})
			.exec(function(err, auditionees) {
				if (err) {
					console.error(err);
				}

				csv.writeToString(auditionees, {headers: true}, function(data) {
					res.writeHeader(200,{
						"Content-Length":data.length,
						"Content-Type":"application/octet-stream",
						"Content-Disposition": "attachment; filename='export.csv'"
					});
					res.send(data);
				});
			});
	});

	router.post('/auditionees/delete', function(req, res) {
		Auditionee.remove({
			_id: req.body.auditioneeId
		}, function(err, auditionee) {
			if (err) {
				console.error('error deleting auditionee: ' + auditionee);
				req.flash('auditioneesMessage', 'error deleting auditionee!');
			} else {
				req.flash('auditioneesMessage', 'Successfully deleted auditionee');
			}
			res.redirect('/admin/auditionees');
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
			var payLoad = _.merge({
				adminusers: adminusers
			}, req.flash());
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
				req.flash('usersMessage', 'User already exists with email, '+req.body.email);
				res.redirect('/admin/users');
			} else {
				console.info("New User: no user found for email, %s ... adding user with token.", req.body.email);
				var token = require('crypto').randomBytes(32).toString('hex');
				var adminUser = new AdminUser();
				adminUser.firstName = req.body.firstName;
				adminUser.lastName = req.body.lastName;
				adminUser.email = req.body.email;
				adminUser.token = utils.createHash(token);
				adminUser.tokenExpires = moment().add(1, 'days');
				adminUser.save(function(err, user) {
					if (err) {
						console.error('error adding user: ' + user);
						req.flash('usersMessage', 'error adding user!');
					} else {
						req.flash('usersMessage', 'Successfully added user. A registration email has been sent.');
						console.log('return user date: '+user);
					}
					piMailer.sendAdminRegistration(user.firstName, user.email, token, user._id);
					res.redirect('/admin/users');
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

	router.post('/email/sendAuditioneeReminder', function(req, res) {
		Auditionee.find({})
		.exec(function(err, auditionees) {
			if (err) {
				console.error(err);
				res.send(500, err);
			}
			piMailer.sendAuditionReminder(auditionees);
			res.send({});
		});
	});

	router.get('/email/:template', function(req, res) {
		res.sendFile(process.cwd() + '/email/templates/'+req.params.template+'.html');
	});

	return router;
})();