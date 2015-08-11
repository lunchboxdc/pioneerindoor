var express = require('express');
var path = require('path');
var moment = require('moment');
var bCrypt = require('bcrypt-nodejs');
var piMailer = require('../email/piMailer');
var AdminUser = require('../persistence/models/adminUser');
var Auditionee = require('../persistence/models/auditionee');
var utils = require('../common/utils');

module.exports = function(passport) {
	var router = express.Router();

	router.get('/',function(req,res) {
		res.render('public/home');
	});

	router.get('/audition',function(req,res) {
		res.render('public/audition');
	});

	router.post('/audition',function(req,res) {
		var auditionee = new Auditionee();
		auditionee.firstName = req.body.firstName;
		auditionee.lastName = req.body.lastName;
		auditionee.address1 = req.body.address1;
		auditionee.address2 = req.body.address2;
		auditionee.city = req.body.city;
		auditionee.state = req.body.state;
		auditionee.zip = req.body.zip;
		auditionee.phone = req.body.phone;
		auditionee.email = req.body.email;
		auditionee.instruments = [req.body.instruments];
		auditionee.comments = req.body.comments;

		auditionee.save(function(err) {
			if (err) {
				console.log(err);
				res.redirect('/audition/error');
			}
			sendEmail();
			res.redirect('/audition/confirm');
		});
	});

	router.get('/audition/confirm',function(req,res) {
		res.render('public/auditionConfirm');
	});

	router.get('/audition/error',function(req,res) {
		res.render('public/auditionError');
	});

	router.get('/login', function(req, res) {
		res.render('public/login', { authMessage: req.flash('authMessage') });
	});

	router.post('/login', passport.authenticate('login', {
		successRedirect: '/admin',
		failureRedirect: '/login',
		failureFlash : true
	}));

	router.get('/register', function(req, res) {
		if(req.query.a && req.query.z) {
			AdminUser.findById(req.query.z, function (err, user) {
				if(user && bCrypt.compareSync(req.query.a, user.token)) {
					if(moment(user.tokenExpires).diff(moment())>0) {
						console.debug('Valid registration token.');
						var payLoad = {
							userId: user._id,
							firstName: user.firstName,
							lastName: user.lastName,
							email: user.email
						};
						res.render('admin/register', payLoad);
					} else {
						console.debug('registration token expired');
						res.render('admin/register', {registerError: 'We\'re sorry, the registration link provided has expired. Please contact the system administrator for a new one.'});
					}
				} else {
					console.debug('No user found by token, %s', user.token);
					res.render('admin/register', {registerError: 'We\'re sorry, an error has occurred. Please contact the system administrator.'});
				}
			});
		} else {
			console.debug('the token query string parameter was not provided.');
			res.render('admin/register', {registerError: 'We\'re sorry, an error has occurred. Please contact the system administrator.'});
		}
	});

	router.post('/register', function(req, res) {
		AdminUser.findById(req.body.userId, function(err, user) {
			if (err) {
				res.render('admin/register', {registerError: 'We\'re sorry, an error has occurred. Please contact the system administrator.'});
			} else {
				user.password = utils.createHash(req.body.password1);
				user.tokenExpires = undefined;
				user.token = undefined;
				user.save(function (err) {
					if (err) {
						res.send(err);
					}
					res.render('admin/register', {registerError: 'Thank you for registering'});
				});

			}
		});
	});

	var sendEmail = function() {
		try {
			var options = {
			    from: 'admin@lunchboxdc.me',
			    to: 'lunchboxdc@gmail.com',
			    subject: 'Test email',
			    html: '<b>Html</b>'
			};

			piMailer.sendMail(options, function(error, info){
			    if(error){
			        console.error(error);
			    } else {
			        console.info('Message sent: ' + info.response);
			    }
			});
		} catch (e) {
			console.error(e);
		}
	};

	return router;
};