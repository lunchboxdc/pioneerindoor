var mongoose = require('mongoose');
var Assets = require('./models/Assets');
var mongooseConnected = false;
var assetsVersion = 0;

module.exports = {
	open: function() {
		if(!mongooseConnected) {
			mongoose.connect('mongodb://localhost/pi');
			mongoose.connection.on("open", function(ref) {
				console.info('Mongoose connection opened');
			    mongooseConnected = true;
				Assets.findOne(function(err, assets) {
					if (err) {
						console.error('error getting assets version!'+err);
					} else {
						if(!assets) {
							assets = new Assets();
							assets.version = 0;
						} else {
							assets.version++;
						}						
					
						assets.save(function(err, assets){
							if(err) {
								console.log('error saving assets version: ' + err);
							} else {
								assetsVersion = assets.version;
							}
						});
					}
				});
			});
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
}