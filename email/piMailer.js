var nodemailer = require('nodemailer');
var ses = require('nodemailer-ses-transport');
var handlebars  = require('handlebars');
var fs = require('fs');
var appConfig = require('../common/appConfig');
var helpers = require('../common/HandlebarsHelpers');
var appConfig = require('../common/appConfig');

for (var helper in helpers) {
    if (helpers.hasOwnProperty(helper)) {
        handlebars.registerHelper(helper, helpers[helper]);
    }
}

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

var auditionUpdateTemplate;
fs.readFile(__dirname + '/templates/auditionUpdate.html', 'utf8', function (err, html) {
    if(err) {
        console.error('piMailer: failed to load auditionUpdateTemplate template: '+err);
    } else {
        auditionUpdateTemplate = handlebars.compile(html);
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
        try {
            if (auditionConfirmationTemplate) {
                var emailHtml = auditionConfirmationTemplate({firstName: firstName, auditionDate: appConfig.auditionDate});
                var options = {
                    from: 'Pioneer Indoor <director@pioneerindoordrums.org>',
                    sender: 'director@pioneerindoordrums.org',
                    replyTo: 'pioneerindoordrums@gmail.com',
                    to: email,
                    subject: 'You\'re registered for Pioneer Indoor auditions!',
                    html: emailHtml
                };

                this.sendMail(options, function (error) {
                    if (error) {
                        console.error(error);
                    } else {
                        console.info('Audition Confirmation email sent for: %s - %s', firstName, email);
                    }
                });
            } else {
                console.error("piMailer: auditionConfirmationTemplate is undefined.");
            }
        } catch (e) {
            console.error("piMailer: error sending email", e);
        }
    },

    sendAuditionReminder: function(auditionees) {
        if(auditionReminderTemplate) {
            var auditionYear = appConfig.auditionDate.year() + 1;

            auditionees.forEach(function(auditionee) {
                var emailHtml = auditionReminderTemplate({firstName: auditionee.firstName, auditionDate: appConfig.auditionDate});
                var options = {
                    to: auditionee.email,
                    from: 'Pioneer Indoor <director@pioneerindoordrums.org>',
                    sender: 'director@pioneerindoordrums.org',
                    replyTo: 'pioneerindoordrums@gmail.com',
                    subject: 'Pioneer Indoor ' + auditionYear + ' Auditions - Important Information',
                    html: emailHtml
                };

                this.sendMail(options, function(error) {
                    if(error) {
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

    sendAuditionUpdate: function(auditionees) {
        if(auditionUpdateTemplate) {
            var auditionYear = appConfig.auditionDate.year() + 1;

            auditionees.forEach(function(auditionee) {
                var emailHtml = auditionUpdateTemplate({firstName: auditionee.firstName, auditionDate: appConfig.auditionDate});
                var options = {
                    to: auditionee.email,
                    from: 'Pioneer Indoor <director@pioneerindoordrums.org>',
                    sender: 'director@pioneerindoordrums.org',
                    replyTo: 'pioneerindoordrums@gmail.com',
                    subject: 'UPDATED BATTERY MATERIALS - Pioneer Indoor ' + auditionYear + ' Auditions',
                    html: emailHtml
                };

                this.sendMail(options, function(error) {
                    if(error) {
                        console.error(error);
                    } else {
                        console.info('Audition update email sent to: %s', auditionee.email);
                    }
                });
            },this);
        } else {
            console.error("piMailer: auditionUpdateTemplate is undefined.");
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