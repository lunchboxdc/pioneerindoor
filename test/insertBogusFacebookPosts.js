var ConnectionManager = require('../persistence/ConnectionManager');
var moment = require('moment');
var PiDAO = require('../persistence/PiDAO');
var FacebookPost = require('../persistence/models/facebookPost');

var facebookPost1 = {};
facebookPost1.facebookId = '431327206';
facebookPost1.attachmentImage = 'https://scontent.xx.fbcdn.net/v/t1.0-0/p180x540/15590560_1327578220627871_2409774284824299046_n.jpg?oh=fdf0d8b71f58ab200306ddedd5fa684e&oe=5919D6B7';
facebookPost1.message = "Some message";
facebookPost1.createdTime = moment().format("YYYY-MM-DD HH:mm:ss");
facebookPost1.statusType = 'addedphotos';
facebookPost1.type = 'photo';
facebookPost1.link = 'httlink';
facebookPost1.picture = 'httpicture';
facebookPost1.name = 'Timeline photos';
facebookPost1.from = 'Pioneer Indoor Percussion Ensemble';

var facebookPost2 = {};
facebookPost2.facebookId = '83144206';
facebookPost2.attachmentImage = 'https://scontent.xx.fbcdn.net/v/t1.0-0/p180x540/15590560_1327578220627871_2409774284824299046_n.jpg?oh=fdf0d8b71f58ab200306ddedd5fa684e&oe=5919D6B7';
facebookPost2.message = "Some message";
facebookPost2.createdTime = moment().format("YYYY-MM-DD HH:mm:ss");
facebookPost2.statusType = 'added_photos';
facebookPost2.type = 'photo';
facebookPost2.link = 'http://link';
facebookPost2.picture = 'http://picture';
facebookPost2.name = 'Timeline photos';
facebookPost2.from = 'Pioneer Indoor Percussion Ensemble';

ConnectionManager.openTest()
    .then(function() {
        return PiDAO.insertFacebookPost(facebookPost1);
    })
    .catch(function(e) {
        console.error(e);
    })
    .then(function(result) {
        console.log('Insert post #1 result:');
        console.log(result);

        return PiDAO.insertFacebookPost(facebookPost2);
    })
    .then(function(result) {
        console.log('Insert post #2 result:');
        console.log(result);
    })
    .catch(function(e) {
        console.error(e);
    })
    .then(function() {
        var mongoPost1 = new FacebookPost();
        mongoPost1._id = facebookPost1.facebookId;
        mongoPost1.attachmentImage = facebookPost1.attachmentImage = 'https://scontent.xx.fbcdn.net/v/t1.0-0/p180x540/15590560_1327578220627871_2409774284824299046_n.jpg?oh=fdf0d8b71f58ab200306ddedd5fa684e&oe=5919D6B7';
        mongoPost1.message = facebookPost1.message = "Some message";
        mongoPost1.created_time = facebookPost1.createdTime = moment().format("YYYY-MM-DD HH:mm:ss");
        mongoPost1.status_type = facebookPost1.statusType = 'addedphotos';
        mongoPost1.type = facebookPost1.type = 'photo';
        mongoPost1.link = facebookPost1.link = 'httlink';
        mongoPost1.picture = facebookPost1.picture = 'httpicture';
        mongoPost1.name = facebookPost1.name = 'Timeline photos';
        mongoPost1.fromName = facebookPost1.from = 'Pioneer Indoor Percussion Ensemble';

        return mongoPost1.save();
    })
    .then(function(result) {
        console.log('Insert post (mongo) #1 result:');
        console.log(result);
    })
    .catch(function(e) {
        console.error(e);
    })
    .then(function() {
        var mongoPost2 = new FacebookPost();
        mongoPost2._id = facebookPost2.facebookId = '83144206';
        mongoPost2.attachmentImage = facebookPost2.attachmentImage = 'https://scontent.xx.fbcdn.net/v/t1.0-0/p180x540/15590560_1327578220627871_2409774284824299046_n.jpg?oh=fdf0d8b71f58ab200306ddedd5fa684e&oe=5919D6B7';
        mongoPost2.message = facebookPost2.message = "Some message";
        mongoPost2.created_time = facebookPost2.createdTime = moment().format("YYYY-MM-DD HH:mm:ss");
        mongoPost2.status_type = facebookPost2.statusType = 'added_photos';
        mongoPost2.type = facebookPost2.type = 'photo';
        mongoPost2.link = facebookPost2.link = 'http://link';
        mongoPost2.picture = facebookPost2.picture = 'http://picture';
        mongoPost2.name = facebookPost2.name = 'Timeline photos';
        mongoPost2.fromName = facebookPost2.from = 'Pioneer Indoor Percussion Ensemble';

        return mongoPost2.save();
    })
    .then(function(result) {
        console.log('Insert post (mongo) #2 result:');
        console.log(result);
    })
    .catch(function(e) {
        console.error(e);
    })
    .then(function() {
        return ConnectionManager.close();
    })
    .catch(function(e) {
        console.error('Error closing connection pool! ' + e.stack);
    })
    .then(function() {
        console.log('\n\nDone!');
        process.exit();
    })
    .catch(function(e) {
        console.error(e.stack);
    });
