var mongoose = require('mongoose');

module.exports = mongoose.model('AdminUser', {
	id: String,
	firstName: String,
	lastName: String,
	email: String,
	password: String,
	apiToken: String,
	token: String,
	tokenExpires: Date,
	dateCreated: { type: Date, default: Date.now },
	dateUpdated: { type: Date, default: Date.now },
	permissions: [{
		type: String
	}]
});