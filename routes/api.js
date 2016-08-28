var express = require('express');
var bCrypt = require('bcrypt-nodejs');
var AdminUser = require('../persistence/models/adminUser');
var Auditionee = require('../persistence/models/auditionee');
var FacebookPost = require('../persistence/models/facebookPost');
var Assets = require('../persistence/models/Assets');
var FacebookService = require('../common/FacebookService');
var async = require('async');

module.exports = (function() {
	var router = express.Router();

	router.all('*', function (req, res, next) {
		var apiToken = req.headers['x-api-token'];
		var userId = req.headers['x-user-id'];

		if(userId && apiToken) {
			AdminUser.findById(userId, function(err, user) {
				if(user && bCrypt.compareSync(apiToken, user.apiToken)) {
					console.debug('Api: successful auth');
					next();
				} else {
					console.debug('Api: user not found or bad token');
					res.json('error');
				}
			});
		} else {
			console.debug('Api: either userId or token was missing');
			res.json('error');
		}
	});

	router.get('/users', function(req, res) {
		var query = AdminUser.find();
		query.exec(function(err, adminUsers) {
			if (err) {
				res.send(err);
			} else {
				res.json(adminUsers);
			}
		});
	});

	router.post('/users', function(req, res) {
		var adminUser = new AdminUser();
		adminUser.firstName = req.body.firstName;
		adminUser.lastName = req.body.lastName;
		adminUser.email = req.body.email;
		adminUser.password = utils.createHash(req.body.password);

		adminUser.save(function(err) {
			if (err) {
				res.send(err);
			} else {
				res.json({message: 'User created!'});
			}
		});
	});

	router.get('/users/:user_id', function(req, res) {
		AdminUser.findById(req.params.user_id, function(err, user) {
			if (err) {
				res.send(err);
			} else {
				res.json(user);
			}
		});
	});

	router.put('/users/:user_id', function(req, res) {
		AdminUser.findById(req.params.user_id, function(err, user) {
			if (err) {
				res.send(err);
			} else {
				user.firstName = req.body.firstName;
				user.lastName = req.body.lastName;
				user.email = req.body.email;
				user.password = utils.createHash(req.body.password);
				user.save(function (err) {
					if (err) {
						res.send(err);
					} else {
						res.json({message: 'user updated!'});
					}
				});
			}
		});
	});

	router.delete('/users/:user_id', function(req, res) {
		AdminUser.remove({
			_id: req.params.user_id
		}, function(err) {
			if (err) {
				res.send(err);
			} else {
				res.json({message: 'Successfully deleted user'});
			}
		});
	});

	router.get('/auditionees', function(req, res) {
		Auditionee.find(function(err, auditionees) {
			if (err) {
				res.send(err);
			} else {
				res.json(auditionees);
			}
		});
	});

	router.get('/facebookPosts', function(req, res) {
		FacebookPost.find({})
			.sort({created_time: 'desc'})
			.exec(function(err, facebookPosts) {
				if (err) {
					res.send(err);
				} else {
					res.json(facebookPosts);
				}
			});
	});

	router.post('/facebookPosts', function(req, res) {
		var posts = JSON.parse(req.rawBody);
		console.log(posts);
		res.send("done");
	});

	router.delete('/facebookPosts/all', function(req, res) {
		FacebookPost.remove({}, function(err) {
			if (err) {
				res.send(err);
			} else {
				res.json({message: 'Successfully deleted all facebook posts'});
			}
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
		FacebookService.getPosts();
		res.send("Facebook service is running");
	});

	return router;
})();