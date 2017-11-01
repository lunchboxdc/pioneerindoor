var nodemailer = require('nodemailer');
var ses = require('nodemailer-ses-transport');
var handlebars  = require('handlebars');
var fs = require('fs');
var appConfig = require('../common/appConfig');
var helpers = require('../common/HandlebarsHelpers');




// todo refactor this
try {
    var devWhitelist = require('../devEmail').whitelist;
} catch (e) {}





for (var helper in helpers) {
    if (helpers.hasOwnProperty(helper)) {
        handlebars.registerHelper(helper, helpers[helper]);
    }
}

var templates = {};

function loadTemplate(template) {
    try {
        var templateHtml = fs.readFileSync(__dirname + '/templates/' + template + '.html', 'utf8');
        templates[template] = handlebars.compile(templateHtml);
    } catch (e) {
        console.error('Failed to compile template: ' + template, e);
    }
}


loadTemplate('adminRegistration');
loadTemplate('adminForgotPassword');
loadTemplate('auditionConfirmation');
loadTemplate('auditionReminder');
loadTemplate('auditionUpdate');


var transport = nodemailer.createTransport(ses({
    region: 'us-west-2',
    accessKeyId: appConfig.piAccessKeyId,
    secretAccessKey: appConfig.piSecretAccessKey,
    rateLimit: 5
}));

module.exports = {

    sendAuditionConfirmation: function(firstName, email) {
        if (templates.auditionConfirmation) {
            var emailHtml = templates.auditionConfirmation({firstName: firstName, auditionDate: appConfig.auditionDate});
            var options = {
                from: 'Pioneer Indoor <director@pioneerindoordrums.org>',
                sender: 'director@pioneerindoordrums.org',
                replyTo: 'pioneerindoordrums@gmail.com',
                to: email,
                subject: 'You\'re registered for Pioneer Indoor auditions!',
                html: emailHtml
            };

            return this.sendMail(options);
        } else {
            throw new Error('auditionConfirmation is undefined');
        }
    },

    sendAuditionReminder: function(auditionees) {
        if (templates.auditionReminder) {
            var auditionYear = appConfig.auditionDate.year() + 1;
            var tasks = [];

            auditionees.forEach(function(auditionee) {
                var emailHtml = templates.auditionReminder({firstName: auditionee.firstName, auditionDate: appConfig.auditionDate});
                var options = {
                    to: auditionee.email,
                    from: 'Pioneer Indoor <director@pioneerindoordrums.org>',
                    sender: 'director@pioneerindoordrums.org',
                    replyTo: 'pioneerindoordrums@gmail.com',
                    subject: 'Pioneer Indoor ' + auditionYear + ' Auditions - Important Information',
                    html: emailHtml
                };

                // todo refactor to Promise.all();
                tasks.push(this.sendMail(options));
            }, this);

            return Promise.all(tasks);
        } else {
            console.error("piMailer: auditionReminderTemplate is undefined.");
        }
    },

    sendAuditionUpdate: function(auditionees) {
        if (templates.auditionUpdate) {
            var auditionYear = appConfig.auditionDate.year() + 1;

            auditionees.forEach(function(auditionee) {
                var emailHtml = templates.auditionUpdate({firstName: auditionee.firstName, auditionDate: appConfig.auditionDate});
                var options = {
                    to: auditionee.email,
                    from: 'Pioneer Indoor <director@pioneerindoordrums.org>',
                    sender: 'director@pioneerindoordrums.org',
                    replyTo: 'pioneerindoordrums@gmail.com',
                    subject: 'UPDATED BATTERY MATERIALS - Pioneer Indoor ' + auditionYear + ' Auditions',
                    html: emailHtml
                };

                // todo refactor to Promise.all();
                return this.sendMail(options);
            },this);
        } else {
            console.error("piMailer: auditionUpdateTemplate is undefined.");
        }
    },

    sendAdminRegistration: function(firstName, email, token, userId) {
        if (templates.adminRegistration) {
            var emailHtml = templates.adminRegistration({host: appConfig.host, firstName: firstName, token: token, userId: userId});
            var options = {
                from: 'admin@pioneerindoordrums.org',
                to: email,
                subject: 'Welcome to Pioneer Indoor',
                html: emailHtml
            };

            return this.sendMail(options);
        } else {
            return Promise.reject('adminRegistrationTemplate is undefined.');
        }
    },

    sendForgotPasswordEmail: function(firstName, email, token, userId) {
        if (templates.adminForgotPassword) {
            var emailHtml = templates.adminForgotPassword({host: appConfig.host, firstName: firstName, token: token, userId: userId});
            var options = {
                from: 'admin@pioneerindoordrums.org',
                to: email,
                subject: 'Reset your Pioneer Indoor password',
                html: emailHtml
            };

            return this.sendMail(options);
        } else {
            console.error("piMailer: adminForgotPasswordTemplate is undefined.");
        }
    },

    sendMail: function(options) {
        if (appConfig.nodeEnv !== 'prod') {
            if (devWhitelist.includes(options.to)) {
                console.info('whitelist has email, sending to: ' + options.to);
                return transport.sendMail(options);
            }
            console.info('Email not in whitelist, doing nothing');
            return Promise.resolve();
        } else {
            return transport.sendMail(options);
        }
    }
};