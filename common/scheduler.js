var CronJob = require('cron').CronJob;
var FacebookService = require('./FacebookService');

var facebookPostJob = new CronJob({
    cronTime: '00 */10 * * * *',
    onTick: function() {
        console.log('FacebookService: running');
        FacebookService.getPosts();
        FacebookService.getProfilePicture();
    },
    start: false,
    timeZone: 'America/Chicago'
});
facebookPostJob.start();