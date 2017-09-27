require('./logger');
var CronJob = require('cron').CronJob;
var FacebookService = require('./FacebookService');
var ConnectionManager = require('../persistence/ConnectionManager');


ConnectionManager.open();
// TODO handle rejection if connection pool not opened


var facebookPostJob = new CronJob({
    cronTime: '00 * * * * *',
    onTick: function() {
        FacebookService.getPosts();
        FacebookService.getProfilePicture();
    },
    start: false,
    timeZone: 'America/Chicago'
});


facebookPostJob.start();
console.info('scheduler started');


process.on('SIGINT', function() {
    ConnectionManager.close();
    console.info('scheduler stopped');
    process.exit();
});