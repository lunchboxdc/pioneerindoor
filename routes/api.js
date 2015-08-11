var express = require('express');

module.exports = (function() {
	var router = express.Router();

	router.all('/', function (req, res, next) {
		var apiToken = req.headers['x-api-token'];
		var userId = req.headers['x-user-id'];
		
		res.send('success');
		//next();
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
			}
			res.json({ message: 'User created!' });
		});
	});

	router.get('/users', function(req, res) {
		AdminUser.find(function(err, adminUsers) {
			if (err) {
				res.send(err);
			}
			res.json(adminUsers);
		});
	});

	router.put('/users/:user_id', function(req, res) {
		AdminUser.findById(req.params.user_id, function(err, user) {
			if (err) {
				res.send(err);
			}
			user.firstName = req.body.firstName;
			user.lastName = req.body.lastName;
			user.email = req.body.email;
			user.password = utils.createHash(req.body.password);
			user.save(function(err) {
				if (err) {
					res.send(err);
				}
				res.json({ message: 'user updated!' });
			});
		});
	});

	router.delete('/users/:user_id', function(req, res) {
		AdminUser.remove({
			_id: req.params.user_id
		}, function(err, bear) {
			if (err) {
				res.send(err);
			}
			res.json({ message: 'Successfully deleted user' });
		});
	});

	return router;
})();	