require('../logger');
var FacebookService = require('../FacebookService');
var ConnectionManager = require('../../persistence/ConnectionManager');



var promise = ConnectionManager.open();

console.log(promise);
// FacebookService.getPosts();
// FacebookService.getProfilePicture();
//
// ConnectionManager.close();


process.on('SIGINT', function() {
    ConnectionManager.close();
});