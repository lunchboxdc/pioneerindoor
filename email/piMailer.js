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

var adminForgotPasswordTemplate;
fs.readFile(__dirname + '/templates/adminForgotPassword.html', 'utf8', function (err, html) {
    if(err) {
        console.error('piMailer: failed to load adminForgotPasswordTemplate template: '+err);
    } else {
        adminForgotPasswordTemplate = handlebars.compile(html);
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

var auditionReminderTemplate;
fs.readFile(__dirname + '/templates/auditionReminder.html', 'utf8', function (err, html) {
    if(err) {
        console.error('piMailer: failed to load auditionReminderTemplate template: '+err);
    } else {
        auditionReminderTemplate = handlebars.compile(html);
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
                from: 'Pioneer Indoor <director@pioneerindoordrums.org>',
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

    sendAuditionReminder: function(auditionees) {
        if(auditionReminderTemplate) {

            auditionees.forEach(function(auditionee) {
                var emailHtml = auditionReminderTemplate(auditionee);
                var options = {
                    to: auditionee.email,
                    from: 'Pioneer Indoor <director@pioneerindoordrums.org>',
                    sender: 'director@pioneerindoordrums.org',
                    replyTo: 'pioneerindoordrums@gmail.com',
                    subject: 'Pioneer Indoor 2016 Auditions - Important Information',
                    html: emailHtml
                };

                this.sendMail(options, function(error, info){
                    if(error){
                        console.error(error);
                    } else {
                        console.info('Audition reminder email sent to: %s', auditionee.email);
                    }
                });
            },this);
        } else {
            console.error("piMailer: auditionReminderTemplate is undefined.");
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
                    console.info('Registration email sent for: %s - %s', firstName, email);
                }
            });
        } else {
            console.error("piMailer: adminRegistrationTemplate is undefined.");
        }
    },

    sendForgotPasswordEmail: function(firstName, email, token, userId) {
        if(adminForgotPasswordTemplate) {
            var emailHtml = adminForgotPasswordTemplate({host: appConfig.host, firstName: firstName, token: token, userId: userId});
            var options = {
                from: 'admin@pioneerindoordrums.org',
                to: email,
                subject: 'Reset your Pioneer Indoor password',
                html: emailHtml
            };

            this.sendMail(options, function(error, info){
                if(error){
                    console.error(error);
                } else {
                    console.info('Forgot password email sent for: %s - %s', firstName, email);
                }
            });
        } else {
            console.error("piMailer: adminForgotPasswordTemplate is undefined.");
        }
    },

    sendMail: function(options, callback) {
        transport.sendMail(options, callback);
    }
};