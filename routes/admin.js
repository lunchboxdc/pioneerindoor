var express = require('express');
var moment = require('moment');
var _ = require('lodash');
var piMailer = require('../email/piMailer');
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
		res.json({
			message: 'Operation currently not supported'
		});
	});

	router.get('/auditionees/export', function(req, res) {
		var season = req.query.season;
		PiDAO.getAuditioneesForSeason(season)
			.then(function(auditionees) {
                var auditioneesExport = [{
                    firstName:'First Name',
                    lastName:'Last Name',
                    birthDate:'Birthdate',
                    phone:'Phone',
                    email:'Email',
                    address1:'Address 1',
                    address2:'Address 2',
                    city:'City',
                    state:'State',
                    zip:'Zip',
                    school:'School',
                    schoolYear:'Year In School',
                    guardianFirstName:'Parent/guardian 1 First Name',
                    guardianLastName:'Parent/guardian 1 Last Name',
                    guardianPhone:'Parent/guardian 1 Phone 1',
                    guardianPhone2:'Parent/guardian 1 Phone 2',
                    guardianEmail:'Parent/guardian 1 Email',
                    guardianAddress1:'Parent/guardian 1 Address 1',
                    guardianAddress2:'Parent/guardian 1 Address 2',
                    guardianCity:'Parent/guardian 1 City',
                    guardianState:'Parent/guardian 1 State',
                    guardianZip:'Parent/guardian 1 Zip',
                    guardian2FirstName:'Parent/guardian 2 First Name',
                    guardian2LastName:'Parent/guardian 2 First Name',
                    guardian2Phone:'Parent/guardian 2 Phone 1',
                    guardian2Phone2:'Parent/guardian 2 Phone 2',
                    guardian2Email:'Parent/guardian 2 Email',
                    guardian2Address1:'Parent/guardian 2 Address 1',
                    guardian2Address2:'Parent/guardian 2 Address 2',
                    guardian2City:'Parent/guardian 2 City',
                    guardian2State:'Parent/guardian 2 State',
                    guardian2Zip:'Parent/guardian 2 Zip',
                    referral:'Referral',
                    referralOther:'Referral (Other)',
                    yearsDrumming:'Number of years drumming',
                    experience:'Experience',
                    instrument1:'Audition Instrument 1',
                    instrument2:'Audition Instrument 2',
                    instrument3:'Audition Instrument 3',
                    specialTalents:'Special Talents',
                    conflicts:'Conflicts',
                    goal:'Goal',
                    submitDate:'Submit Date'
                }];

                for (var i = 0; i < auditionees.length; i++) {
                    var exportRow = {};
                    exportRow.firstName = auditionees[i].firstName;
                    exportRow.lastName = auditionees[i].lastName;
                    exportRow.birthDate = auditionees[i].birthDate;
                    exportRow.phone = auditionees[i].phone;
                    exportRow.email = auditionees[i].email;
                    exportRow.address1 = auditionees[i].address1;
                    exportRow.address2 = auditionees[i].address2;
                    exportRow.city = auditionees[i].city;
                    exportRow.state = auditionees[i].state;
                    exportRow.zip = auditionees[i].zip;
                    exportRow.school = auditionees[i].school;
                    exportRow.schoolYear = auditionees[i].schoolYear;
                    exportRow.guardianFirstName = auditionees[i].guardianFirstName;
                    exportRow.guardianLastName = auditionees[i].guardianLastName;
                    exportRow.guardianPhone = auditionees[i].guardianPhone;
                    exportRow.guardianPhone2 = auditionees[i].guardianPhone2;
                    exportRow.guardianEmail = auditionees[i].guardianEmail;
                    exportRow.guardianAddress1 = auditionees[i].guardianAddress1;
                    exportRow.guardianAddress2 = auditionees[i].guardianAddress2;
                    exportRow.guardianCity = auditionees[i].guardianCity;
                    exportRow.guardianState = auditionees[i].guardianState;
                    exportRow.guardianZip = auditionees[i].guardianZip;
                    exportRow.guardian2FirstName = auditionees[i].guardian2FirstName;
                    exportRow.guardian2LastName = auditionees[i].guardian2LastName;
                    exportRow.guardian2Phone = auditionees[i].guardian2Phone;
                    exportRow.guardian2Phone2 = auditionees[i].guardian2Phone2;
                    exportRow.guardian2Email = auditionees[i].guardian2Email;
                    exportRow.guardian2Address1 = auditionees[i].guardian2Address1;
                    exportRow.guardian2Address2 = auditionees[i].guardian2Address2;
                    exportRow.guardian2City = auditionees[i].guardian2City;
                    exportRow.guardian2State = auditionees[i].guardian2State;
                    exportRow.guardian2Zip = auditionees[i].guardian2Zip;
                    exportRow.referral = auditionees[i].referral;
                    exportRow.referralOther = auditionees[i].referralOther;
                    exportRow.yearsDrumming = auditionees[i].yearsDrumming;
                    exportRow.experience = auditionees[i].experience;
                    exportRow.instrument1 = auditionees[i].instrument1;
                    exportRow.instrument2 = auditionees[i].instrument2;
                    exportRow.instrument3 = auditionees[i].instrument3;
                    exportRow.specialTalents = auditionees[i].specialTalents;
                    exportRow.conflicts = auditionees[i].conflicts;
                    exportRow.goal = auditionees[i].goal;
                    exportRow.submitDate = auditionees[i].auditionInfoCreateDate;
                    auditioneesExport.push(exportRow);
                }

                var fileName = 'pioneerIndoorAuditionees_' + moment().format('YYYY-MM-DD') + '.csv';
                res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
                res.csv(auditioneesExport);
			})
			.catch(function(e) {
				console.error('Error generating auditionee export.', e)
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
		req.flash('errorMessage', 'Operation currently not supported');
		res.redirect('/admin/users');
	});

	router.post('/email/sendAuditioneeReminder', function(req, res) {
		PiDAO.getAuditioneesForEmail(req.body.season)
			.then(function(auditionees) {
                piMailer.sendAuditionReminder(auditionees);
                res.send({});
			})
			.catch(function(e) {
                console.error(e);
                res.send(500, e);
			});
	});

	router.get('/email/:template', function(req, res) {
		res.sendFile(process.cwd() + '/email/templates/' + req.params.template + '.html');
	});

	return router;
})();
