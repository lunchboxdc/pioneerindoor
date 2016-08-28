var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

module.exports = mongoose.model('FacebookPost', {
	//id: ObjectId,
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