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

var instrumentTemplate;
fs.readFile('views/public/partials/auditionInstruments.html', 'utf8', function (err, html) {
	if(err) {
		console.error('public: failed to load auditionInstruments template: '+err);
	} else {
		instrumentTemplate = handlebars.compile(html);
	}
});


module.exports = function(passport) {
	var router = express.Router();

	router.get('/',function(req,res) {
		FacebookPost.find({})
			.sort({created_time: 'desc'})
			.exec(function(err, facebookPosts) {
				if (err) {
					console.error(err);
				}
				res.render('public/home', {facebookPosts: facebookPosts});
			});
	});

	router.get('/audition',function(req,res) {
		var payLoad =_.merge({
			page: 'audition'
		}, req.flash());

		res.render('public/audition', payLoad);
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

		auditionee.save(function(err, auditionee) {
			if (err) {
				console.log(err);
				req.flash('auditionMessage', 'An error has occurred. Please try again later.');
				res.redirect('/audition');
			} else {
				piMailer.sendAuditionConfirmation(auditionee.firstName, auditionee.email);
				res.redirect('/audition/confirm');
			}
		});
	});

	router.get('/audition/confirm',function(req,res) {
		res.render('public/auditionConfirm');
	});

	router.get('/schedule',function(req,res) {
		var payLoad =_.merge({
			page: 'schedule'
		}, req.flash());

		res.render('public/construction', payLoad);
	});

	router.get('/staff',function(req,res) {
		var payLoad =_.merge({
			page: 'staff'
		}, req.flash());

		res.render('public/construction', payLoad);
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

	router.get('/login', function(req, res) {
		var payLoad =_.merge({}, req.flash());
		res.render('public/login', payLoad);
	});

	router.post('/login', passport.authenticate('login', {
		successRedirect: '/admin',
		failureRedirect: '/login',
		failureFlash : true
	}));

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
						res.render('public/register', {registerMessage: 'Thank you for registering'});
					} else {
						req.flash('email', user.email);
						res.redirect('/login');
					}
				});
			}
		});
	});

	return router;
};