var express = require('express');
var bCrypt = require('bcrypt-nodejs');
var _ = require('lodash');
var FacebookService = require('../common/FacebookService');
var async = require('async');
var moment = require('moment');
var PiDAO = require('../persistence/PiDAO');
var Promise = require('bluebird');

module.exports = (function() {
	var router = express.Router();

	router.all('*', function (req, res, next) {
		var apiToken = req.headers['x-api-token'];
		var userId = req.headers['x-user-id'];

		if (userId && apiToken) {
			PiDAO.getStaffUserById(userId)
				.then(function(user) {
                    if(user[0] && bCrypt.compareSync(apiToken, user[0].apiToken)) {
                        console.debug('Api: successful auth');
                        next();
                    } else {
                        console.debug('Api: user not found or bad token');
                        res.json('error');
                    }
				})
				.catch(function(e) {
					console.error(e);
                    res.json('error');
				});
		} else {
			console.debug('Api: either userId or token was missing');
			res.json('error');
		}
	});

	router.get('/users', function(req, res) {
		PiDAO.getAllStaffUsers()
			.then(function(users) {
				// TODO remove password and apiToken from response
				res.json(users);
			})
			.catch(function(e) {
				res.send(e);
			});
	});

	router.get('/facebookPosts', function(req, res) {
		PiDAO.getFacebookPosts()
			.then(function(posts) {
				res.json(posts);
			})
			.catch(function(e) {
				res.send(e);
			});
	});

	router.delete('/facebookPosts/all', function(req, res) {
		PiDAO.deleteAllFacebookPosts()
			.then(function() {
                res.json({message: 'Successfully deleted all facebook posts'});
			})
			.catch(function(e) {
				res.send(e);
			});
	});

	router.get('/assetsVersion', function(req, res) {
		Assets.find({})
			.exec(function(err, results) {
				if (err) {
					res.send(err);
				} else {
					res.json(results);
				}
			});
	});

	router.delete('/assetsVersion', function(req, res) {
		Assets.remove({}, function(err) {
			if (err) {
				res.send(err);
			} else {
				res.json({message: 'Successfully deleted assets version'});
			}
		});
	});

	router.get('/runFacebookService', function(req, res) {
		console.info('Running facebook service...');
		FacebookService.getPosts();
		FacebookService.getProfilePicture();
		res.send('Facebook service is running');
	});

	router.get('/initNewAuditioneeAttributes', function(req, res) {
		console.info('Updating auditionee attributes...');
		Auditionee.find({})
			.sort({submitDate:'asc'})
			.exec(function(err, auditionees) {
				if (err) {
					console.log(err);
				} else {
					async.each(auditionees, function(auditionee) {
						auditionee.season = 2016;
						auditionee.deleted = false;
						auditionee.save(function(err) {
							if (err) {
								console.log(err);
							} else {
								console.log('updated auditionee');
							}
						})
					});
				}
			});
		res.send('Updating auditionee attributes');
	});

    router.get('/insertBogusFacebookPosts', function(req, res) {
        var facebookPost = {};
        facebookPost.facebookId = '4508311242_1327206';
        facebookPost.attachmentImage = 'https://scontent.xx.fbcdn.net/v/t1.0-0/p180x540/15590560_1327578220627871_2409774284824299046_n.jpg?oh=fdf0d8b71f58ab200306ddedd5fa684e&oe=5919D6B7';
        facebookPost.message = "Some message";
        facebookPost.createdTime = moment().format("YYYY-MM-DD HH:mm:ss");
        facebookPost.status_type = 'added_photos';
        facebookPost.type = 'photo';
        facebookPost.link = 'http://link';
        facebookPost.picture = 'http://picture';
        facebookPost.name = 'Timeline photos';
        facebookPost.fromName = 'Pioneer Indoor Percussion Ensemble';

        PiDAO.insertFacebookPost(facebookPost)
            .then(function(result) {
                console.log(result);
            })
            .catch(function(e) {
                console.error(e);
            })
            .then(function() {
                var facebookPost = {};
                facebookPost.facebookId = '831111111242_1327206';
                facebookPost.attachmentImage = 'https://scontent.xx.fbcdn.net/v/t1.0-0/p180x540/15590560_1327578220627871_2409774284824299046_n.jpg?oh=fdf0d8b71f58ab200306ddedd5fa684e&oe=5919D6B7';
                facebookPost.message = "Some message";
                facebookPost.created_time = moment().format("YYYY-MM-DD HH:mm:ss");
                facebookPost.statusType = 'added_photos';
                facebookPost.type = 'photo';
                facebookPost.link = 'http://link';
                facebookPost.picture = 'http://picture';
                facebookPost.name = 'Timeline photos';
                facebookPost.fromName = 'Pioneer Indoor Percussion Ensemble';

                PiDAO.insertFacebookPost(facebookPost);
            })
            .then(function(result) {
                console.log(result);
            })
            .catch(function(e) {
                console.error(e);
            })
            .then(function() {
                res.send('Finished inserting bogus facebook posts.');
            });
    });

	return router;
})();