var express = require('express');
var moment = require('moment');
var _ = require('lodash');
var piMailer = require('../email/piMailer');
var AdminUser = require('../persistence/models/adminUser');
var Auditionee = require('../persistence/models/auditionee');
var utils = require('../common/utils');
var csv = require('express-csv');
var stringify = require('node-stringify');
var appConfig = require('../common/appConfig');
var handlebarsHelpers = require('../common/HandlebarsHelpers');
var AssetsVersion = require('../persistence/AssetsVersion');
var PiDAO = require('../persistence/PiDAO');

module.exports = (function() {
	var router = express.Router();

	router.get('/', function(req, res) {
		res.render('admin/home');
	});

	var auditioneesRoute = function(req, res) {
		var payLoad = _.merge({
			handlebarsHelpers: stringify(handlebarsHelpers),
			auditionDate: appConfig.auditionDate.toISOString(),
			assetsVersion: AssetsVersion.getAssetsVersion()
		}, req.flash());


		PiDAO.getAuditionSeasons()
			.then(function(result) {
                var seasons = [];

                for (var i = 0; i < result.length; i++) {
                    seasons.push(result[i].season);
                }

                var selectedSeason = seasons[0];
                if (req.body.season) {
                    selectedSeason = parseInt(req.body.season);
                }

                payLoad.seasons = seasons;
                payLoad.selectedSeason = selectedSeason;

                return PiDAO.getAuditioneesForSeason(selectedSeason);
			})
			.then(function(result) {
				var auditionees = result;
                payLoad.auditionees = auditionees;
                payLoad.auditioneesString = JSON.stringify(auditionees);
                var total = 0;

                var stats = {
                    firstChoice: {
                        'Front ensemble (percussion)': 0,
                        'Front ensemble (electronics)': 0,
                        'Snare': 0,
                        'Tenor': 0,
                        'Bass': 0,
                        'Cymbals': 0,
                        'Character': 0,
                        'Electric Guitar': 0,
                        'Drumset': 0
                    },
                    secondChoice: {
                        'Front ensemble (percussion)': 0,
                        'Front ensemble (electronics)': 0,
                        'Snare': 0,
                        'Tenor': 0,
                        'Bass': 0,
                        'Cymbals': 0,
                        'Character': 0,
                        'Electric Guitar': 0,
                        'Drumset': 0
                    },
                    thirdChoice: {
                        'Front ensemble (percussion)': 0,
                        'Front ensemble (electronics)': 0,
                        'Snare': 0,
                        'Tenor': 0,
                        'Bass': 0,
                        'Cymbals': 0,
                        'Character': 0,
                        'Electric Guitar': 0,
                        'Drumset': 0
                    }
                };

                for (var i = 0; i < auditionees.length; i++) {
                    total++;

                    var firstChoice = auditionees[i].instrument1;
                    if (firstChoice.length > 0) {
                        stats.firstChoice[firstChoice]++;
                    }
                    var secondChoice = auditionees[i].instrument2;
                    if (secondChoice && secondChoice.length > 0) {
                        stats.secondChoice[secondChoice]++;
                    }
                    var thirdChoice = auditionees[i].instrument3;
                    if (thirdChoice && thirdChoice.length > 0) {
                        stats.thirdChoice[thirdChoice]++;
                    }
                }

                for (var choice in stats) {
                    if (!stats.hasOwnProperty(choice)) continue;

                    var instruments = stats[choice];
                    for (var instrument in instruments) {
                        if (!instruments.hasOwnProperty(instrument)) continue;

                        var count = instruments[instrument];
                        if (count < 1) {
                            delete instruments[instrument];
                        }
                    }

                    if (_.isEmpty(instruments)) {
                        delete stats[choice];
                    }
                }

                payLoad.stats = stats;
                payLoad.total = total;
			})
            .catch(function(err) {
                console.error('error getting auditionees: ' + err + err.stack);
                payLoad.errorMessage = 'Error getting auditionees from database!';
            })
            .finally(function() {
                res.render('admin/auditionees', payLoad);
            });
	};

	router.get('/auditionees', auditioneesRoute);
	router.post('/auditionees', auditioneesRoute);

	router.get('/auditioneeUpdate', function(req, res) {
		var payLoad = _.merge({
			handlebarsHelpers: stringify(handlebarsHelpers),
			auditionDate: appConfig.auditionDate.toISOString()
		}, req.flash());
		res.render('admin/auditioneeUpdate', payLoad);
	});

	router.post('/email/sendAuditioneeUpdate', function(req, res) {
		var maxSubmitDate = moment("2016-10-04T02:00:00.000Z", moment.ISO_8601, true);
		Auditionee.find({
				season: '2017',
				submitDate: {
					$lte: maxSubmitDate
				}
			})
			.sort({submitDate: 'asc'})
			.exec(function(err, auditionees) {
				if (err) {
					res.send(err);
				} else {
					piMailer.sendAuditionUpdate(auditionees);
					res.json({
						message: 'Successfully queued update emails'
					});
				}
			});
	});

	router.get('/auditionees/export', function(req, res) {
		var season = req.query.season;
		Auditionee.find({
			season: season,
			deleted: false
		})
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

			for (var i = 0; i < auditionees.length; i++) {
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

			var fileName = 'pioneerIndoorAuditionees_' + moment().format('YYYY-MM-DD') + '.csv';
			res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
			res.csv(auditioneesExport);
		});
	});

	router.post('/auditionees/delete', function(req, res) {
		PiDAO.getStudentById(req.body.studentId)
			.then(function(result) {
				if (result[0]) {
					var student = result[0];
					student.deleted = true;
					return PiDAO.updateStudent(student);
				} else {
                    throw new Error('Student not found in database.');
				}
			})
			.then(function() {
                req.flash('successMessage', 'Successfully deleted auditionee');
			})
			.catch(function(e) {
                console.error('error deleting student by id: ' + req.body.studentId, e);
                req.flash('errorMessage', 'error deleting auditionee!');
			})
			.then(function() {
                res.redirect('/admin/auditionees');
			});
	});

	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/admin');
	});

	router.get('/users', function(req, res) {
		var payLoad;
		PiDAO.getAllStaffUsers()
			.then(function(result) {
                payLoad = _.merge({
                    staffUsers: result
                }, req.flash());
			})
			.catch(function(e) {
                console.error(e);
                req.flash('errorMessage', 'Error getting staff users');
			})
			.then(function() {
                res.render('admin/users', payLoad);
			});
	});

	router.get('/users/new', function(req, res) {
		res.render('admin/newUser');
	});

	router.get('/table', function(req, res) {
		res.render('admin/table');
	});

	router.post('/users/new', function(req, res) {
		var email = req.body.email.toLowerCase();
		var staffUser;

		PiDAO.getStaffUserByEmail(email)
			.then(function(result) {
				if (result[0]) {
                    req.flash('errorMessage', 'User already exists with email, ' + email);
				} else {
                    var token = require('crypto').randomBytes(32).toString('hex');
                    staffUser = {
                        firstName: req.body.firstName,
						lastName: req.body.lastName,
						email: email,
						resetToken: utils.createHash(token),
                        resetTokenExpiration: moment().add(1, 'days').format("YYYY-MM-DD HH:mm:ss")
					};

                    return PiDAO.insertStaffUser(staffUser)
                        .then(function(result) {
                        	if (result.insertId) {
                                return piMailer.sendAdminRegistration(staffUser.firstName, staffUser.email, token, result.insertId);
							} else {
                        		throw new Error('Failed to insert staff user into database.');
							}
                        })
                        .then(function() {
                            req.flash('successMessage', 'Successfully added user. A registration email has been sent.');
                        });
				}
			})
			.catch(function(e) {
                console.error('error adding user.', e);
                req.flash('errorMessage', 'error adding user!');
			})
			.then(function() {
                res.redirect('/admin/users');
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

	// router.post('/email/sendAuditioneeReminder', function(req, res) {
	// 	Auditionee.find({season: req.body.season, deleted: false})
	// 	.exec(function(err, auditionees) {
	// 		if (err) {
	// 			console.error(err);
	// 			res.send(500, err);
	// 		}
	// 		piMailer.sendAuditionReminder(auditionees);
	// 		res.send({});
	// 	});
	// });

	router.get('/email/:template', function(req, res) {
		res.sendFile(process.cwd() + '/email/templates/'+req.params.template+'.html');
	});

	return router;
})();