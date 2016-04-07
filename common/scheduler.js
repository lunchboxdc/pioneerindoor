var CronJob = require('cron').CronJob;
var FacebookService = require('./FacebookService');

var facebookPostJob = new CronJob({
    cronTime: '00 */1 * * * *',
    onTick: function() {
        FacebookService.getPosts();
        FacebookService.getProfilePicture();
    },
    start: false,
    timeZone: 'America/Chicago'
});
//facebookPostJob.start();