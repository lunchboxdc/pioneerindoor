var mongoose = require('mongoose');

module.exports = mongoose.model('AdminUser',{
	id: String,
	firstName: String,
	lastName: String,
	email: String,
	password: String
});