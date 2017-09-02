require('../common/logger');
var ConnectionManager = require('../persistence/ConnectionManager');
var FacebookService = require('../common/FacebookService');


ConnectionManager.open();

FacebookService.getPosts()
    .then(function() {
        return ConnectionManager.close();
    })
    .then(function() {
        console.log('Done!');
    })
    .catch(function(e) {
        console.error(e.stack);
    })
    .finally(function() {
        process.exit();
    });
