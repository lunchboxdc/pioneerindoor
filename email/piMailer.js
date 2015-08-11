var nodemailer = require('nodemailer');
var ses = require('nodemailer-ses-transport');
var handlebars  = require('handlebars');
var fs = require('fs');
var appConfig = require('../common/appConfig');

var newUserTemplate;
fs.readFile('email/templates/newAdminUser.html', 'utf8', function (err, html) {
    if(err) {
        console.error('piMailer: failed to load newUser template: '+err);
    } else {
        newUserTemplate = handlebars.compile(html);
    }
});

var transport = nodemailer.createTransport(ses({
    region: 'us-west-2',
    accessKeyId: process.env.SES_ACCESS_KEY_ID,
    secretAccessKey: process.env.SES_SECRET_ACCESS_KEY,
    rateLimit: 5
}));

module.exports = {

    emailNewAdmin: function(firstName, email, token, userId) {
        if(newUserTemplate) {
            var emailHtml = newUserTemplate({host: appConfig.host, firstName: firstName, token: token, userId: userId});
            var options = {
                from: 'admin@lunchboxdc.me',
                to: 'lunchboxdc@gmail.com',
                subject: 'Welcome to Pioneer Indoor',
                html: emailHtml
            };

            this.sendMail(options, function(error, info){
                if(error){
                    console.error(error);
                } else {
                    console.info('New User email sent for: %s - %s', firstName, email);
                }
            });
        } else {
            console.error("piMailer: newUserTemplate is undefined.");
        }
    },

    sendMail: function(options, callback) {
        transport.sendMail(options, callback);
    }
};