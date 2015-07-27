var mongoose = require('mongoose');

module.exports = mongoose.model('Auditionee',{
	id: String,
	firstName: String,
	lastName: String,
	address1: String,
	address2: String,
	city: String,
	state: String,
	zip: Number,
	phone: String,
	email: String,
	instruments: Array,
	comments: String
});