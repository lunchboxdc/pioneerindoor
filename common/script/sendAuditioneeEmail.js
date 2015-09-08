var piMailer = require('../../email/piMailer');

setTimeout(function() {
    piMailer.sendAuditionConfirmation('Andy', 'andrew.hull@vividseats.com');
},2000);