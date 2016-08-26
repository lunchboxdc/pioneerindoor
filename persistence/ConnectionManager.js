var mongoose = require('mongoose');
var Assets = require('./models/Assets');
var mongooseConnected = false;
var assetsVersion = 0;

mongoose.Promise = require('bluebird');

module.exports = {
	open: function(callback) {


		if(!mongooseConnected) {
			try {
				mongoose.connect('mongodb://localhost/pi');
				var promise = mongoose.connection.on("open", function() {
					console.info('Mongoose connection opened');
					mongooseConnected = true;
					Assets.findOne(function (err, assets) {
						if (err) {
							console.error('error getting assets version!' + err);
						} else {
							if (!assets) {
								assets = new Assets();
								assets.version = 0;
							} else {
								assets.version++;
							}

							assets.save(function (err, assets) {
								if (err) {
									console.log('error saving assets version: ' + err);
								} else {
									assetsVersion = assets.version;
								}
							});
						}
					});
				});

				mongoose.connection.on('error',function (e) {
					console.error('failed to connect to database' + e);
				});
			} catch (e) {
				console.error('failed to connect to database' + e);
			}

			return promise;
		}
	},
	close: function() {
		mongoose.connection.close(function () {
			mongooseConnected = false;
			console.info('Mongoose connection closed');
			process.exit(0);
		});
	},
	isConnected: function() {
		return mongooseConnected;
	},
	getAssetsVersion: function() {
		return assetsVersion;
	}
};