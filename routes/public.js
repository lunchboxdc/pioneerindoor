var express = require('express');
var path = require('path');
var moment = require('moment');
var bCrypt = require('bcrypt-nodejs');
var _ = require('lodash');
var fs = require('fs');
var handlebars  = require('handlebars');
var piMailer = require('../email/piMailer');
var AdminUser = require('../persistence/models/adminUser');
var Auditionee = require('../persistence/models/auditionee');
var FacebookPost = require('../persistence/models/facebookPost');
var utils = require('../common/utils');
var xml2js = require('xml2js');
var appConfig = require('../common/appConfig');
var request = require('request');

var packetsPath = process.cwd() + '/assets/auditionMaterials/';
var batteryPacket = 'BatteryPacket.pdf';
var cymbalPacket = 'CymbalPacket.pdf';
var frontEnsemblePacket = 'FrontEnsemblePacket.pdf';
var auditionDate = appConfig.auditionDate;

module.exports = function(passport) {
	var router = express.Router();

	router.get('/',function(req,res) {
		FacebookPost.find({})
			.sort({created_time: 'desc'})
			.limit(5)
			.exec(function(err, facebookPosts) {
				if (err) {
					console.error(err);
				}
				res.render('public/home', {facebookPosts: facebookPosts});
			});
	});

	router.get('/pay',function(req,res) {
		var payLoad =_.merge({
			page: 'pay'
		}, req.flash());

		res.render('public/pay-billing', payLoad);
	});

	router.post('/pay',function(req,res) {

		// var postObject = {
		// 	sale: {
		// 		'api-key': '2F822Rw39fx762MaV7Yy86jXGTC7sCDy',
		// 		'redirect-url': 'http://localhost:3000/pay-redirect',
		// 		'amount': req.body.amount,
		// 		'ip-address': req.connection.remoteAddress,
		// 		'currency': 'USD',
		// 		'order-description': 'tuition',
		// 		'billing': {
		// 			'first-name': req.body.firstName,
		// 			'last-name': req.body.lastName,
		// 			'address1': req.body.address1,
		// 			'city': req.body.city,
		// 			'state': req.body.state,
		// 			'postal': req.body.zip,
		// 			'country': 'US',
		// 			'email': req.body.email,
		// 			'phone': req.body.phone
		// 		}
		// 	}
		// };

		var postObject = {
			sale: {
				'api-key': '2F822Rw39fx762MaV7Yy86jXGTC7sCDy',
				'redirect-url': 'http://localhost:3000/pay-redirect',
				'amount': req.body.amount
			}
		};

		var builder = new xml2js.Builder();
		var xml = builder.buildObject(postObject);

		console.log('\n\n' + xml + '\n\n');

		request({
			url: 'https://secure.paylinedatagateway.com/api/v2/three-step',
			method: 'post',
			headers: {
				'Content-Type': 'text/xml'
			},
			body: xml
		}, function(error, response, body) {
			if (error) {
				console.log('error!!!  ' + error);
			} else {
				xml2js.parseString(body, function(err, jsonBody) {
					var response = jsonBody.response;
					console.log('payline response: ' + body);

					var payLoad =_.merge({
						page: 'pay'
					}, req.flash());

					if (response.result && response.result.length === 1 && response.result[0] == 1) {
						payLoad.transactionUrl = response['form-url'][0];
						res.render('public/pay-card-info', payLoad);
					} else {
						payLoad.payMessage = 'Error!';
						res.render('public/pay-billing', payLoad);
					}
				});
			}
		});
	});

	router.get('/pay-redirect',function(req, res) {
		if (req.query['token-id']) {

			var queryString = '';
			for (var query in req.query) {
				if (!req.query.hasOwnProperty(query)) continue;
				queryString += query + '=' + req.query[query] + '  ';
			}
			console.log('success - query: ' + queryString);

			res.redirect('/pay-confirm');
		} else {
			res.redirect('/pay-credit-card');
		}
	});

	router.get('/pay-confirm',function(req, res) {
		var payLoad =_.merge({
			page: 'pay-confirm'
		}, req.flash());

		res.render('public/pay-confirm', payLoad);
	});

	router.get('/audition',function(req,res) {
		var payLoad =_.merge({
			page: 'audition',
			auditionDate: auditionDate
		}, req.flash());

		res.render('public/audition', payLoad);
	});

	router.get('/audition-soon',function(req,res) {
		var payLoad =_.merge({
			page: 'audition-soon'
		}, req.flash());

		res.render('public/audition-soon', payLoad);
	});

	router.post('/audition',function(req,res) {
		var auditionee = new Auditionee();
		auditionee.firstName = req.body.firstName;
		auditionee.lastName = req.body.lastName;
		auditionee.dob = req.body.dob;
		auditionee.phone = req.body.phone;
		auditionee.email = req.body.email;
		auditionee.address1 = req.body.address1;
		auditionee.address2 = req.body.address2;
		auditionee.city = req.body.city;
		auditionee.state = req.body.state;
		auditionee.zip = req.body.zip;
		auditionee.school = req.body.school;
		auditionee.schoolYear = req.body.schoolYear;
		auditionee.pg1FirstName = req.body.pg1FirstName;
		auditionee.pg1LastName = req.body.pg1LastName;
		auditionee.pg1Phone1 = req.body.pg1Phone1;
		auditionee.pg1Phone2 = req.body.pg1Phone2;
		auditionee.pg1Email = req.body.pg1Email;
		auditionee.pg1Address1 = req.body.pg1Address1;
		auditionee.pg1Address2 = req.body.pg1Address2;
		auditionee.pg1City = req.body.pg1City;
		auditionee.pg1State = req.body.pg1State;
		auditionee.pg1Zip = req.body.pg1Zip;
		auditionee.pg2FirstName = req.body.pg2FirstName;
		auditionee.pg2LastName = req.body.pg2LastName;
		auditionee.pg2Phone1 = req.body.pg2Phone1;
		auditionee.pg2Phone2 = req.body.pg2Phone2;
		auditionee.pg2Email = req.body.pg2Email;
		auditionee.pg2Address1 = req.body.pg2Address1;
		auditionee.pg2Address2 = req.body.pg2Address2;
		auditionee.pg2City = req.body.pg2City;
		auditionee.pg2State = req.body.pg2State;
		auditionee.pg2Zip = req.body.pg2Zip;
		auditionee.referral = req.body.referral;
		auditionee.referralOther = req.body.referralOther;
		auditionee.yearsDrumming = req.body.yearsDrumming;
		auditionee.experience = req.body.experience;
		auditionee.auditionInstrument1 = req.body.auditionInstrument1;
		auditionee.auditionInstrument2 = req.body.auditionInstrument2;
		auditionee.auditionInstrument3 = req.body.auditionInstrument3;
		auditionee.specialTalents = req.body.specialTalents;
		auditionee.conflicts = req.body.conflicts;
		auditionee.goal = req.body.goal;
		auditionee.submitDate = moment();
		auditionee.deleted = false;
		auditionee.season = req.body.season;

		auditionee.save(function(err, auditionee) {
			if (err) {
				console.log(err);
				for(var field in req.body) {
					if (req.body.hasOwnProperty(field)) {
						req.flash(field, req.body[field]);
					}
				}
				req.flash('auditionMessage', 'We\'re sorry, something went wrong. Please try again. If the error continues, please email <a href="mailto:admin@pioneerindoordrums.org">admin@pioneerindoordrums.org</a>');
				res.redirect('/audition');
			} else {
				piMailer.sendAuditionConfirmation(auditionee.firstName, auditionee.email);
				res.redirect('/audition/confirm');
			}
		});
	});

	router.get('/audition/confirm',function(req,res) {
		var payLoad =_.merge({
			auditionDate: auditionDate
		}, req.flash());
		res.render('public/auditionConfirm', payLoad);
	});

	router.get('/schedule',function(req,res) {
		var payLoad =_.merge({
			page: 'schedule'
		}, req.flash());

		res.render('public/schedule', payLoad);
	});

	router.get('/faq',function(req,res) {
		var payLoad =_.merge({
			page: 'faq'
		}, req.flash());

		res.render('public/faq', payLoad);
	});

	router.get('/staff',function(req,res) {
		var payLoad =_.merge({
			page: 'staff'
		}, req.flash());

		res.render('public/staff', payLoad);
	});

	router.get('/media',function(req,res) {
		var payLoad =_.merge({
			page: 'media'
		}, req.flash());

		res.render('public/construction', payLoad);
	});

	router.get('/about',function(req,res) {
		var payLoad =_.merge({
			page: 'about'
		}, req.flash());

		res.render('public/about', payLoad);
	});

	router.get('/support',function(req,res) {
		var payLoad =_.merge({
			page: 'support'
		}, req.flash());

		res.render('public/support', payLoad);
	});

	router.get('/login', function(req, res) {
		var payLoad =_.merge({}, req.flash());
		res.render('public/login', payLoad);
	});

	router.post('/login', passport.authenticate('login', {
		successRedirect: '/admin',
		failureRedirect: '/login',
		failureFlash : true
	}));

	router.get('/forgotPassword', function(req, res) {
		var payLoad =_.merge({}, req.flash());
		res.render('public/forgotPassword', payLoad);
	});

	router.post('/forgotPassword', function(req, res) {
		var email = req.body.email.toLowerCase();
		AdminUser.findOne({ 'email': email }, function (err, adminUser) {
			if(adminUser) {
				var token = require('crypto').randomBytes(32).toString('hex');
				adminUser.token = token;
				adminUser.token = utils.createHash(token);
				adminUser.tokenExpires = moment().add(1, 'days');
				adminUser.save(function (err) {
					if (err) {
						console.error("Error setting token and token expiration for forgot password for: "+adminUser.email, err);
						req.flash('errorMessage', 'We\'re sorry, an error occurred. Please try again.');
						res.redirect('/forgotPassword');
					} else {
						piMailer.sendForgotPasswordEmail(adminUser.firstName, adminUser.email, token, adminUser._id);
						console.info("Successfully sent forgot password email to: "+adminUser.email);
						res.render('public/forgotPasswordSuccess');
					}
				});
			} else {
				req.flash('errorMessage', 'We\'re sorry, we were unable to find an account with that email address. Please try again.');
				res.redirect('/forgotPassword');
			}
		});
	});

	router.get('/resetPassword', function(req, res) {
		if(req.query.a && req.query.z) {
			AdminUser.findById(req.query.z, function (err, user) {
				if(err) {
					console.error("Error looking up resetPassword userId and token.",err);
					res.render('public/resetPassword', {errorMessage: 'We\'re sorry, an error has occurred. Please contact the system administrator.'});
				}
				if(user && user.token && bCrypt.compareSync(req.query.a, user.token)) {
					if(moment(user.tokenExpires).diff(moment())>0) {
						console.debug('Valid forgot password token.');
						var payLoad = {
							userId: user._id
						};
						res.render('public/resetPassword', payLoad);
					} else {
						console.debug('forgot password token expired');
						res.render('public/resetPassword', {errorMessage: 'We\'re sorry, the forgot password link provided has expired. Please go back to the \'forgot password\' page and generate another email.'});
					}
				} else {
					console.debug('Forgot password: No user found by token, %s', req.query.a);
					res.render('public/resetPassword', {errorMessage: 'We\'re sorry, an error has occurred. Please contact the system administrator.'});
				}
			});
		} else {
			console.debug('the token query string parameter was not provided.');
			res.render('public/resetPassword', {errorMessage: 'We\'re sorry, an error has occurred. Please contact the system administrator.'});
		}
	});

	router.post('/resetPassword', function(req, res) {
		AdminUser.findById(req.body.userId, function(err, user) {
			if (err || !user) {
				console.error("Error resetting password for userId: " + req.body.userId);
				res.render('public/resetPassword', {errorMessage: 'We\'re sorry, an error has occurred. Please contact the system administrator.'});
			} else {
				user.password = utils.createHash(req.body.password1);
				user.tokenExpires = undefined;
				user.token = undefined;
				user.save(function (err, user) {
					if (err) {
						console.error("Error removing token and expiration from user: " + user.email);
						res.render('public/resetPassword', {errorMessage: 'We\'re sorry, an error has occurred. Please contact the system administrator.'});
					} else {
						console.info("Successfully reset password for: " + user.email);
						req.flash('email', user.email);
						res.redirect('/login');
					}
				});
			}
		});
	});

	router.get('/register', function(req, res) {
		if(req.query.a && req.query.z) {
			AdminUser.findById(req.query.z, function (err, user) {
				if(user && user.token && bCrypt.compareSync(req.query.a, user.token)) {
					if(moment(user.tokenExpires).diff(moment())>0) {
						console.debug('Valid registration token.');
						var payLoad = {
							userId: user._id,
							firstName: user.firstName,
							lastName: user.lastName,
							email: user.email
						};
						res.render('public/register', payLoad);
					} else {
						console.debug('registration token expired');
						res.render('public/register', {registerMessage: 'We\'re sorry, the registration link provided has expired. Please contact the system administrator for a new one.'});
					}
				} else {
					console.debug('No user found by token, %s', req.query.a);
					res.render('public/register', {registerMessage: 'We\'re sorry, an error has occurred. Please contact the system administrator.'});
				}
			});
		} else {
			console.debug('the token query string parameter was not provided.');
			res.render('public/register', {registerMessage: 'We\'re sorry, an error has occurred. Please contact the system administrator.'});
		}
	});

	router.post('/register', function(req, res) {
		AdminUser.findById(req.body.userId, function(err, user) {
			if (err || !user) {
				res.render('public/register', {registerMessage: 'We\'re sorry, an error has occurred. Please contact the system administrator.'});
			} else {
				user.password = utils.createHash(req.body.password1);
				user.tokenExpires = undefined;
				user.token = undefined;
				user.save(function (err, user) {
					if (err) {
						res.render('public/register', {registerMessage: 'We\'re sorry, an error occurred. Please contact the system administrator.'});
					} else {
						req.flash('email', user.email);
						res.redirect('/login');
					}
				});
			}
		});
	});

	router.get('/packets/battery', function(req, res) {
		var fileStats = fs.statSync(packetsPath+batteryPacket);
		res.writeHeader(200,{
			"Content-Length":fileStats.size,
			"Content-Type":"application/octet-stream",
			"Content-Disposition": "attachment; filename='"+batteryPacket+"'"
		});
		var fReadStream = fs.createReadStream(packetsPath+batteryPacket);
		fReadStream.pipe(res);
	});

	router.get('/packets/cymbal', function(req, res) {
		var fileStats = fs.statSync(packetsPath+cymbalPacket);
		res.writeHeader(200,{
			"Content-Length":fileStats.size,
			"Content-Type":"application/octet-stream",
			"Content-Disposition": "attachment; filename='"+cymbalPacket+"'"
		});
		var fReadStream = fs.createReadStream(packetsPath+cymbalPacket);
		fReadStream.pipe(res);
	});

	router.get('/packets/frontEnsemble', function(req, res) {
		var fileStats = fs.statSync(packetsPath+frontEnsemblePacket);
		res.writeHeader(200,{
			"Content-Length":fileStats.size,
			"Content-Type":"application/octet-stream",
			"Content-Disposition": "attachment; filename='"+frontEnsemblePacket+"'"
		});
		var fReadStream = fs.createReadStream(packetsPath+frontEnsemblePacket);
		fReadStream.pipe(res);
	});

	return router;
};