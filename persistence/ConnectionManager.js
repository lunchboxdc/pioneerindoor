var mongoose = require('mongoose');

var mongooseConnected = false;

module.exports = {
	open: function() {
		if(!mongooseConnected) {
			mongoose.connect('mongodb://localhost/pi');
			mongoose.connection.on("open", function(ref) {
				console.info('Mongoose connection opened');
			    mongooseConnected = true;
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
	}
}