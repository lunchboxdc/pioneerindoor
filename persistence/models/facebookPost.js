var mongoose = require('mongoose');

module.exports = mongoose.model('FacebookPost', {
	_id: String,
	fromName: String,
	name: String,
	story: String,
	message: String,
	picture: String,
	attachmentImage: String,
	link: String,
	description: String,
	caption: String,
	type: String,
	status_type: String,
	created_time: String
});