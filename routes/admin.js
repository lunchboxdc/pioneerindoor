var express = require('express');
var path = require('path');
var moment = require('moment');
var _ = require('lodash');
var piMailer = require('../email/piMailer');
var AdminUser = require('../persistence/models/adminUser');
var Auditionee = require('../persistence/models/auditionee');
var utils = require('../common/utils');
var csv = require('express-csv');
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

			var stats = {
				total: 0,
				firstChoice: {},
				secondChoice: {},
				thirdChoice: {}
			};

			for(var i=0; i<auditionees.length; i++) {
				stats.total++;

				var auditionInsrument1 = auditionees[i].auditionInstrument1;
				var auditionInsrument2 = auditionees[i].auditionInstrument2;
				var auditionInsrument3 = auditionees[i].auditionInstrument3;

				if(typeof stats.firstChoice[auditionInsrument1]==='undefined') {
					stats.firstChoice[auditionees[i].auditionInstrument1] = 1;
				} else {
					stats.firstChoice[auditionees[i].auditionInstrument1]++;
				}

				if(typeof stats.secondChoice[auditionInsrument2]==='undefined') {
					stats.secondChoice[auditionees[i].auditionInstrument2] = 1;
				} else {
					stats.secondChoice[auditionees[i].auditionInstrument2]++;
				}

				if(typeof stats.thirdChoice[auditionInsrument3]==='undefined') {
					stats.thirdChoice[auditionees[i].auditionInstrument3] = 1;
				} else {
					stats.thirdChoice[auditionees[i].auditionInstrument3]++;
				}
			}

			var payLoad = _.merge({
				auditionees: auditionees,
				auditioneesString: JSON.stringify(auditionees),
				stats: stats
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

				var auditioneesExport = [{
					firstName:'First Name',
					lastName:'Last Name',
					dob:'Birthdate',
					phone:'Phone',
					email:'Email',
					address1:'Address 1',
					address2:'Address 2',
					city:'City',
					state:'State',
					zip:'Zip',
					school:'School',
					schoolYear:'Year In School',
					pg1FirstName:'Parent/guardian 1 First Name',
					pg1LastName:'Parent/guardian 1 Last Name',
					pg1Phone1:'Parent/guardian 1 Phone 1',
					pg1Phone2:'Parent/guardian 1 Phone 2',
					pg1Email:'Parent/guardian 1 Email',
					pg1Address1:'Parent/guardian 1 Address 1',
					pg1Address2:'Parent/guardian 1 Address 2',
					pg1City:'Parent/guardian 1 City',
					pg1State:'Parent/guardian 1 State',
					pg1Zip:'Parent/guardian 1 Zip',
					pg2FirstName:'Parent/guardian 2 First Name',
					pg2LastName:'Parent/guardian 2 First Name',
					pg2Phone1:'Parent/guardian 2 Phone 1',
					pg2Phone2:'Parent/guardian 2 Phone 2',
					pg2Email:'Parent/guardian 2 Email',
					pg2Address1:'Parent/guardian 2 Address 1',
					pg2Address2:'Parent/guardian 2 Address 2',
					pg2City:'Parent/guardian 2 City',
					pg2State:'Parent/guardian 2 State',
					pg2Zip:'Parent/guardian 2 Zip',
					referral:'Referral',
					referralOther:'Referral (Other)',
					yearsDrumming:'Number of years drumming',
					experience:'Experience',
					auditionInstrument1:'Audition Instrument 1',
					auditionInstrument2:'Audition Instrument 2',
					auditionInstrument3:'Audition Instrument 3',
					specialTalents:'Special Talents',
					conflicts:'Conflicts',
					goal:'Goal',
					submitDate:'Submit Date'
				}];
				for(var i=0; i<auditionees.length; i++) {
					var exportRow = {};
					exportRow.firstName=auditionees[i].firstName;
					exportRow.lastName=auditionees[i].lastName;
					exportRow.dob=auditionees[i].dob;
					exportRow.phone=auditionees[i].phone;
					exportRow.email=auditionees[i].email;
					exportRow.address1=auditionees[i].address1;
					exportRow.address2=auditionees[i].address2;
					exportRow.city=auditionees[i].city;
					exportRow.state=auditionees[i].state;
					exportRow.zip=auditionees[i].zip;
					exportRow.school=auditionees[i].school;
					exportRow.schoolYear=auditionees[i].schoolYear;
					exportRow.pg1FirstName=auditionees[i].pg1FirstName;
					exportRow.pg1LastName=auditionees[i].pg1LastName;
					exportRow.pg1Phone1=auditionees[i].pg1Phone1;
					exportRow.pg1Phone2=auditionees[i].pg1Phone2;
					exportRow.pg1Email=auditionees[i].pg1Email;
					exportRow.pg1Address1=auditionees[i].pg1Address1;
					exportRow.pg1Address2=auditionees[i].pg1Address2;
					exportRow.pg1City=auditionees[i].pg1City;
					exportRow.pg1State=auditionees[i].pg1State;
					exportRow.pg1Zip=auditionees[i].pg1Zip;
					exportRow.pg2FirstName=auditionees[i].pg2FirstName;
					exportRow.pg2LastName=auditionees[i].pg2LastName;
					exportRow.pg2Phone1=auditionees[i].pg2Phone1;
					exportRow.pg2Phone2=auditionees[i].pg2Phone2;
					exportRow.pg2Email=auditionees[i].pg2Email;
					exportRow.pg2Address1=auditionees[i].pg2Address1;
					exportRow.pg2Address2=auditionees[i].pg2Address2;
					exportRow.pg2City=auditionees[i].pg2City;
					exportRow.pg2State=auditionees[i].pg2State;
					exportRow.pg2Zip=auditionees[i].pg2Zip;
					exportRow.referral=auditionees[i].referral;
					exportRow.referralOther=auditionees[i].referralOther;
					exportRow.yearsDrumming=auditionees[i].yearsDrumming;
					exportRow.experience=auditionees[i].experience;
					exportRow.auditionInstrument1=auditionees[i].auditionInstrument1;
					exportRow.auditionInstrument2=auditionees[i].auditionInstrument2;
					exportRow.auditionInstrument3=auditionees[i].auditionInstrument3;
					exportRow.specialTalents=auditionees[i].specialTalents;
					exportRow.conflicts=auditionees[i].conflicts;
					exportRow.goal=auditionees[i].goal;
					exportRow.submitDate=auditionees[i].submitDate;
					auditioneesExport.push(exportRow);
				}

				var fileName = "pioneerIndoorAuditionees_"+moment().format('YYYY-MM-DD')+".csv";
				res.setHeader('Content-disposition', 'attachment; filename='+fileName);
				res.csv(auditioneesExport);
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
				req.flash('errorMessage', 'User already exists with email, '+req.body.email);
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
						req.flash('errorMessage', 'error adding user!');
					} else {
						req.flash('successMessage', 'Successfully added user. A registration email has been sent.');
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
			req.flash('errorMessage', 'you can\'t delete the user you\'re logged in with!');
			res.redirect('/admin/users');
		} else {
			AdminUser.remove({
				_id: req.body.userId
			}, function(err, user) {
				if (err) {
					console.error('error deleting user: ' + user);
					req.flash('errorMessage', 'error deleting user!');
				} else {
					req.flash('successMessage', 'Successfully deleted user');
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