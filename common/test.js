var FacebookService = require('./FacebookService');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/pi');

FacebookService.getPosts();