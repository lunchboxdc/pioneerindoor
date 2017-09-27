var express = require('express');
var moment = require('moment');
var bCrypt = require('bcrypt-nodejs');
var _ = require('lodash');
var fs = require('fs');
var piMailer = require('../email/piMailer');
var AdminUser = require('../persistence/models/adminUser');
var Auditionee = require('../persistence/models/auditionee');
var utils = require('../common/utils');
var xml2js = require('xml2js');
var appConfig = require('../common/appConfig');
var request = require('request');
var PiDAO = require('../persistence/PiDAO');

var packetsPath = process.cwd() + '/assets/auditionMaterials/';
var batteryPacket = 'BatteryPacket.pdf';
var cymbalPacket = 'CymbalPacket.pdf';
var frontEnsemblePacket = 'FrontEnsemblePacket.pdf';
var auditionDate = appConfig.auditionDate;

var auditionActive = false;
var scheduleActive = false;

function returnAuditionSoonPage(req, res) {
    var payLoad = _.merge({
        page: 'audition-soon',
        auditionDate: auditionDate
    }, req.flash());
    res.render('public/audition-soon', payLoad);
}

function returnScheduleSoonPage(req, res) {
    var payLoad =_.merge({
        page: 'schedule-soon',
        auditionDate: auditionDate
    }, req.flash());
    res.render('public/schedule-soon', payLoad);
}

module.exports = function(passport) {
	var router = express.Router();

	router.get('/',function(req, res) {
		var facebookPosts;
		PiDAO.getFacebookPosts()
			.then(function(posts) {
                facebookPosts = posts;
			})
			.catch(function(e) {
				console.error('Error getting facebook posts!' + e);
			})
			.finally(function() {
                res.render('public/home', {facebookPosts: facebookPosts});
			});
	});

	// router.get('/pay',function(req,res) {
	// 	var payLoad =_.merge({
	// 		page: 'pay'
	// 	}, req.flash());
    //
	// 	res.render('public/pay-billing', payLoad);
	// });

	// router.post('/pay',function(req,res) {
    //
	// 	// var postObject = {
	// 	// 	sale: {
	// 	// 		'api-key': '2F822Rw39fx762MaV7Yy86jXGTC7sCDy',
	// 	// 		'redirect-url': 'http://localhost:3000/pay-redirect',
	// 	// 		'amount': req.body.amount,
	// 	// 		'ip-address': req.connection.remoteAddress,
	// 	// 		'currency': 'USD',
	// 	// 		'order-description': 'tuition',
	// 	// 		'billing': {
	// 	// 			'first-name': req.body.firstName,
	// 	// 			'last-name': req.body.lastName,
	// 	// 			'address1': req.body.address1,
	// 	// 			'city': req.body.city,
	// 	// 			'state': req.body.state,
	// 	// 			'postal': req.body.zip,
	// 	// 			'country': 'US',
	// 	// 			'email': req.body.email,
	// 	// 			'phone': req.body.phone
	// 	// 		}
	// 	// 	}
	// 	// };
    //
	// 	var postObject = {
	// 		sale: {
	// 			'api-key': '2F822Rw39fx762MaV7Yy86jXGTC7sCDy',
	// 			'redirect-url': 'http://localhost:3000/pay-redirect',
	// 			'amount': req.body.amount
	// 		}
	// 	};
    //
	// 	var builder = new xml2js.Builder();
	// 	var xml = builder.buildObject(postObject);
    //
	// 	console.log('\n\n' + xml + '\n\n');
    //
	// 	request({
	// 		url: 'https://secure.paylinedatagateway.com/api/v2/three-step',
	// 		method: 'post',
	// 		headers: {
	// 			'Content-Type': 'text/xml'
	// 		},
	// 		body: xml
	// 	}, function(error, response, body) {
	// 		if (error) {
	// 			console.log('error!!!  ' + error);
	// 		} else {
	// 			xml2js.parseString(body, function(err, jsonBody) {
	// 				var response = jsonBody.response;
	// 				console.log('payline response: ' + body);
    //
	// 				var payLoad =_.merge({
	// 					page: 'pay'
	// 				}, req.flash());
    //
	// 				if (response.result && response.result.length === 1 && response.result[0] == 1) {
	// 					payLoad.transactionUrl = response['form-url'][0];
	// 					res.render('public/pay-card-info', payLoad);
	// 				} else {
	// 					payLoad.payMessage = 'Error!';
	// 					res.render('public/pay-billing', payLoad);
	// 				}
	// 			});
	// 		}
	// 	});
	// });

	// router.get('/pay-redirect',function(req, res) {
	// 	if (req.query['token-id']) {
    //
	// 		var queryString = '';
	// 		for (var query in req.query) {
	// 			if (!req.query.hasOwnProperty(query)) continue;
	// 			queryString += query + '=' + req.query[query] + '  ';
	// 		}
	// 		console.log('success - query: ' + queryString);
    //
	// 		res.redirect('/pay-confirm');
	// 	} else {
	// 		res.redirect('/pay-credit-card');
	// 	}
	// });

	// router.get('/pay-confirm',function(req, res) {
	// 	var payLoad =_.merge({
	// 		page: 'pay-confirm'
	// 	}, req.flash());
    //
	// 	res.render('public/pay-confirm', payLoad);
	// });

	router.get('/audition',function(req, res) {
		if (auditionActive) {
            var payLoad =_.merge({
                page: 'audition',
                auditionDate: auditionDate
            }, req.flash());

            res.render('public/audition', payLoad);
		} else {
            returnAuditionSoonPage(req, res);
		}
	});

	router.post('/audition', function(req, res) {
        if (auditionActive) {
            var studentId;
            var studentAddressId;
            var guardianAddressId;
            var guardian2AddressId;

            var studentAddress = {
                address1: req.body.address1,
                city: req.body.city,
                state: req.body.state,
                zip: req.body.zip
            };

            if (req.body.address2) {
                studentAddress['address2'] = req.body.address2;
            }

            PiDAO.insertAddress(studentAddress)
                .then(function(result) {
                    studentAddressId = result.insertId;
                    if (req.body.pg1Address1) {
                        var guardianAddress = {
                            address1: req.body.pg1Address1,
                            city: req.body.pg1City,
                            state: req.body.pg1State,
                            zip: req.body.pg1Zip
                        };

                        if (req.body.pg1Address2) {
                            studentAddress['address2'] = req.body.pg1Address2;
                        }

                        return PiDAO.insertAddress(guardianAddress);
                    }
                })
                .then(function(result) {
                    guardianAddressId = result ? result.insertId : studentAddressId;

                    if (req.body.pg2Address1) {
                        var guardian2Address = {
                            address1: req.body.pg2Address1,
                            city: req.body.pg2City,
                            state: req.body.pg2State,
                            zip: req.body.pg2Zip
                        };

                        if (req.body.pg2Address2) {
                            studentAddress['address2'] = req.body.pg2Address2;
                        }

                        return PiDAO.insertAddress(guardian2Address);
                    }
                })
                .then(function(result) {
                    if (req.body.pg2FirstName) {
                        guardian2AddressId = result ? result.insertId : guardianAddressId;
                    }

                    var student = {
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        birthDate: moment(req.body.dob, 'MM/DD/YYYY').format('YYYY-MM-DD'),
                        phone: req.body.phone,
                        addressId: studentAddressId,
                        guardianFirstName: req.body.pg1FirstName,
                        guardianLastName: req.body.pg1LastName,
                        guardianPhone: req.body.pg1Phone1,
                        guardianEmail: req.body.pg1Email,
                        guardianAddressId: guardianAddressId,
                        guardian2FirstName: req.body.pg2FirstName,
                        guardian2LastName: req.body.pg2LastName,
                        guardian2Phone: req.body.pg2Phone1,
                        guardian2Phone2: req.body.pg2Phone2,
                        guardian2Email: req.body.pg2Email,
                        guardian2AddressId: guardian2AddressId
                    };

                    if (req.body.pg1Phone2) {
                        student['guardianPhone2'] = req.body.pg1Phone2;
                    }

                    return PiDAO.insertStudent(student);
                })
                .then(function(result) {
                    studentId = result.insertId;
                    var auditionInfo = {
                        instrument1: req.body.auditionInstrument1,
                        referral: req.body.referral,
                        referralOther: req.body.referralOther,
                        yearsDrumming: req.body.yearsDrumming,
                        goal: req.body.goal,
                        season: req.body.season,
                        studentId: studentId
                    };

                    if (req.body.school) {
                        auditionInfo['school'] = req.body.school;
                    }

                    if (req.body.schoolYear) {
                        auditionInfo['schoolYear'] = req.body.schoolYear;
                    }

                    if (req.body.auditionInstrument2) {
                        auditionInfo['instrument2'] = req.body.auditionInstrument2;
                    }

                    if (req.body.auditionInstrument3) {
                        auditionInfo['instrument3'] = req.body.auditionInstrument3;
                    }

                    if (req.body.experience) {
                        auditionInfo['experience'] = req.body.experience;
                    }

                    if (req.body.conflicts) {
                        auditionInfo['conflicts'] = req.body.conflicts;
                    }

                    if (req.body.specialTalents) {
                        auditionInfo['specialTalents'] = req.body.specialTalents;
                    }

                    return PiDAO.insertAuditionInfo(auditionInfo);
                })
                .then(function() {
                    piMailer.sendAuditionConfirmation(req.body.firstName, req.body.email, studentId);
                    res.redirect('/audition/confirm');
                })
                .catch(function(e) {
                    console.error('error inserting auditionee.', e);

                    _.each(req.body, function(value, key) {
                        req.flash(key, value);
                    });

                    req.flash('auditionMessage', 'We\'re sorry, something went wrong. Please try again. If the error continues, please email <a href="mailto:admin@pioneerindoordrums.org">admin@pioneerindoordrums.org</a>');
                    res.redirect('/audition');
                });
        } else {
            returnAuditionSoonPage(req, res);
		}
	});

	router.get('/audition/confirm',function(req, res) {
		if (auditionActive) {
            var payLoad = _.merge({
                auditionDate: auditionDate
            }, req.flash());
            res.render('public/auditionConfirm', payLoad);
		} else {
            returnAuditionSoonPage(req, res);
		}
	});

	router.get('/schedule',function(req, res) {
		if (scheduleActive) {
            var payLoad =_.merge({
                page: 'schedule',
                auditionDate: auditionDate
            }, req.flash());

            res.render('public/schedule', payLoad);
		} else {
            returnScheduleSoonPage(req, res);
		}
	});

	router.get('/faq',function(req, res) {
		var payLoad =_.merge({
			page: 'faq'
		}, req.flash());

		res.render('public/faq', payLoad);
	});

	router.get('/staff',function(req, res) {
		var payLoad =_.merge({
			page: 'staff',
            auditionDate: auditionDate
		}, req.flash());

		res.render('public/staff', payLoad);
	});

	// router.get('/media',function(req, res) {
	// 	var payLoad =_.merge({
	// 		page: 'media'
	// 	}, req.flash());
    //
	// 	res.render('public/construction', payLoad);
	// });

	router.get('/about',function(req, res) {
		var payLoad =_.merge({
			page: 'about'
		}, req.flash());

		res.render('public/about', payLoad);
	});

	router.get('/support',function(req, res) {
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
		var payLoad = _.merge({}, req.flash());
		res.render('public/forgotPassword', payLoad);
	});

	router.post('/forgotPassword', function(req, res) {
		var email = req.body.email.toLowerCase();
		var staffUser;
		var resetToken;

		PiDAO.getStaffUserByEmail(email)
            .then(function(result) {
                staffUser = result[0];
                if (staffUser) {
                    resetToken = require('crypto').randomBytes(32).toString('hex');
                    staffUser.resetToken = utils.createHash(resetToken);
                    staffUser.resetTokenExpiration = moment().add(1, 'days').format("YYYY-MM-DD HH:mm:ss");

                    return PiDAO.updateStaffUser(staffUser);
                } else {
                    req.flash('errorMessage', 'We\'re sorry, an error occurred. Please try again.');
                    res.redirect('/forgotPassword');
                }
            })
            .then(function() {
                piMailer.sendForgotPasswordEmail(staffUser.firstName, staffUser.email, resetToken, staffUser.id);
                console.info("Successfully sent forgot password email to staffUser: " + staffUser.id);
                res.render('public/forgotPasswordSuccess');
            })
            .catch(function(e) {
                console.error("Error handling forgot password: ", e);
                req.flash('errorMessage', 'We\'re sorry, an error occurred. Please try again.');
                res.redirect('/forgotPassword');
            });
	});

	// router.get('/resetPassword', function(req, res) {
	// 	if(req.query.a && req.query.z) {
	// 		AdminUser.findById(req.query.z, function (err, user) {
	// 			if(err) {
	// 				console.error("Error looking up resetPassword userId and token.",err);
	// 				res.render('public/resetPassword', {errorMessage: 'We\'re sorry, an error has occurred. Please contact the system administrator.'});
	// 			}
	// 			if(user && user.token && bCrypt.compareSync(req.query.a, user.token)) {
	// 				if(moment(user.tokenExpires).diff(moment())>0) {
	// 					console.debug('Valid forgot password token.');
	// 					var payLoad = {
	// 						userId: user._id
	// 					};
	// 					res.render('public/resetPassword', payLoad);
	// 				} else {
	// 					console.debug('forgot password token expired');
	// 					res.render('public/resetPassword', {errorMessage: 'We\'re sorry, the forgot password link provided has expired. Please go back to the \'forgot password\' page and generate another email.'});
	// 				}
	// 			} else {
	// 				console.debug('Forgot password: No user found by token, %s', req.query.a);
	// 				res.render('public/resetPassword', {errorMessage: 'We\'re sorry, an error has occurred. Please contact the system administrator.'});
	// 			}
	// 		});
	// 	} else {
	// 		console.debug('the token query string parameter was not provided.');
	// 		res.render('public/resetPassword', {errorMessage: 'We\'re sorry, an error has occurred. Please contact the system administrator.'});
	// 	}
	// });

	// router.post('/resetPassword', function(req, res) {
	// 	AdminUser.findById(req.body.userId, function(err, user) {
	// 		if (err || !user) {
	// 			console.error("Error resetting password for userId: " + req.body.userId);
	// 			res.render('public/resetPassword', {errorMessage: 'We\'re sorry, an error has occurred. Please contact the system administrator.'});
	// 		} else {
	// 			user.password = utils.createHash(req.body.password1);
	// 			user.tokenExpires = undefined;
	// 			user.token = undefined;
	// 			user.save(function (err, user) {
	// 				if (err) {
	// 					console.error("Error removing token and expiration from user: " + user.email);
	// 					res.render('public/resetPassword', {errorMessage: 'We\'re sorry, an error has occurred. Please contact the system administrator.'});
	// 				} else {
	// 					console.info("Successfully reset password for: " + user.email);
	// 					req.flash('email', user.email);
	// 					res.redirect('/login');
	// 				}
	// 			});
	// 		}
	// 	});
	// });

	// router.get('/register', function(req, res) {
	// 	if(req.query.a && req.query.z) {
	// 		AdminUser.findById(req.query.z, function (err, user) {
	// 			if(user && user.token && bCrypt.compareSync(req.query.a, user.token)) {
	// 				if(moment(user.tokenExpires).diff(moment())>0) {
	// 					console.debug('Valid registration token.');
	// 					var payLoad = {
	// 						userId: user._id,
	// 						firstName: user.firstName,
	// 						lastName: user.lastName,
	// 						email: user.email
	// 					};
	// 					res.render('public/register', payLoad);
	// 				} else {
	// 					console.debug('registration token expired');
	// 					res.render('public/register', {registerMessage: 'We\'re sorry, the registration link provided has expired. Please contact the system administrator for a new one.'});
	// 				}
	// 			} else {
	// 				console.debug('No user found by token, %s', req.query.a);
	// 				res.render('public/register', {registerMessage: 'We\'re sorry, an error has occurred. Please contact the system administrator.'});
	// 			}
	// 		});
	// 	} else {
	// 		console.debug('the token query string parameter was not provided.');
	// 		res.render('public/register', {registerMessage: 'We\'re sorry, an error has occurred. Please contact the system administrator.'});
	// 	}
	// });

	// router.post('/register', function(req, res) {
	// 	AdminUser.findById(req.body.userId, function(err, user) {
	// 		if (err || !user) {
	// 			res.render('public/register', {registerMessage: 'We\'re sorry, an error has occurred. Please contact the system administrator.'});
	// 		} else {
	// 			user.password = utils.createHash(req.body.password1);
	// 			user.tokenExpires = undefined;
	// 			user.token = undefined;
	// 			user.save(function (err, user) {
	// 				if (err) {
	// 					res.render('public/register', {registerMessage: 'We\'re sorry, an error occurred. Please contact the system administrator.'});
	// 				} else {
	// 					req.flash('email', user.email);
	// 					res.redirect('/login');
	// 				}
	// 			});
	// 		}
	// 	});
	// });

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