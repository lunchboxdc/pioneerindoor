var piMailer = require('../../email/piMailer');

setTimeout(function() {
    piMailer.sendAuditionConfirmation('Andy', 'lunchboxdc@gmail.com');
},2000);