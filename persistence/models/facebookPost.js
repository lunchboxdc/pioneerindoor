var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

module.exports = mongoose.model('FacebookPost',{
	id: ObjectId,
	postId: {
		type: String,
		unique: true,
		dropDups: true
	},
	name: String,
	story: String,
	message: String,
	picture: String,
	link: String,
	type: String,
	created_time: Date
});