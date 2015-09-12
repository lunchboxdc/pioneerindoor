var mongoose = require('mongoose');

module.exports = mongoose.model('Assets',{
	id: String,
	version: Number
});