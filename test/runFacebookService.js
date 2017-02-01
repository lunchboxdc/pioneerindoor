require('../common/logger');
var ConnectionManager = require('../persistence/ConnectionManager');
var FacebookService = require('../common/FacebookService');


ConnectionManager.openTest()
    .then(function() {
        return FacebookService.getPostsTest();
    })
    .then(function() {
        return ConnectionManager.close();
    })
    .then(function() {
        console.log('\nDone!');
    })
    .catch(function(e) {
        console.error(e.stack);
    })
    .finally(function() {
        process.exit();
    });
