var nodemailer = require('nodemailer');
var ses = require('nodemailer-ses-transport');
var handlebars  = require('handlebars');
var fs = require('fs');
var appConfig = require('../common/appConfig');

var adminRegistrationTemplate;
fs.readFile(__dirname + '/templates/adminRegistration.html', 'utf8', function (err, html) {
    if(err) {
        console.error('piMailer: failed to load adminRegistrationTemplate template: '+err);
    } else {
        adminRegistrationTemplate = handlebars.compile(html);
    }
});

var auditionConfirmationTemplate;
fs.readFile(__dirname + '/templates/auditionConfirmation.html', 'utf8', function (err, html) {
    if(err) {
        console.error('piMailer: failed to load auditionConfirmationTemplate template: '+err);
    } else {
        auditionConfirmationTemplate = handlebars.compile(html);
    }
});

var transport = nodemailer.createTransport(ses({
    region: 'us-west-2',
    accessKeyId: process.env.SES_ACCESS_KEY_ID,
    secretAccessKey: process.env.SES_SECRET_ACCESS_KEY,
    rateLimit: 5
}));

module.exports = {

    sendAuditionConfirmation: function(firstName, email) {
        if(auditionConfirmationTemplate) {
            var emailHtml = auditionConfirmationTemplate({firstName: firstName});
            var options = {
                from: 'Pioneer Indoor <admin@pioneerindoordrums.org>',
                sender: 'director@pioneerindoordrums.org',
                replyTo: 'pioneerindoordrums@gmail.com',
                to: email,
                subject: 'You\'re registered for Pioneer Indoor auditions!',
                html: emailHtml
            };

            this.sendMail(options, function(error, info){
                if(error){
                    console.error(error);
                } else {
                    console.info('Audition Confirmation email sent for: %s - %s', firstName, email);
                }
            });
        } else {
            console.error("piMailer: auditionConfirmationTemplate is undefined.");
        }
    },

    sendAdminRegistration: function(firstName, email, token, userId) {
        if(adminRegistrationTemplate) {
            var emailHtml = adminRegistrationTemplate({host: appConfig.host, firstName: firstName, token: token, userId: userId});
            var options = {
                from: 'admin@pioneerindoordrums.org',
                to: email,
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