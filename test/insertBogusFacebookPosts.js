var ConnectionManager = require('../persistence/ConnectionManager');
var moment = require('moment');
var PiDAO = require('../persistence/PiDAO');

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

ConnectionManager.open();

PiDAO.insertFacebookPost(facebookPost1)
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
        ConnectionManager.close();
        console.log('\n\nDone!');
        process.exit();
    })
    .catch(function(e) {
        console.error(e.stack);
    });
