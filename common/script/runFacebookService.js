var FacebookService = require('../FacebookService');
var mongoose = require('mongoose');

if(!mongooseConnected) {
	mongoose.connect('mongodb://localhost/pi');
}

FacebookService.getPosts();
FacebookService.getProfilePicture();