var express = require('express');
var path = require("path");
var nodemailer = require('nodemailer');
var ses = require('nodemailer-ses-transport');
var Auditionee = require('../persistence/models/auditionee');

module.exports = (function() {
	var router = express.Router();

	router.get('/',function(req,res) {
		res.render('public/home');
	});

	router.get('/audition',function(req,res) {
		res.render('public/audition');
	});

	router.post('/audition',function(req,res) {
		var auditionee = new Auditionee();
		auditionee.firstName = req.body.firstName;
		auditionee.lastName = req.body.lastName;
		auditionee.address1 = req.body.address1;
		auditionee.address2 = req.body.address2;
		auditionee.city = req.body.city;
		auditionee.state = req.body.state;
		auditionee.zip = req.body.zip;
		auditionee.phone = req.body.phone;
		auditionee.email = req.body.email;
		auditionee.instruments = [req.body.instruments];
		auditionee.comments = req.body.comments;

		auditionee.save(function(err) {
			if (err) {
				console.log(err);
				res.redirect('/audition/error');
			}
			sendEmail();
			res.redirect('/audition/confirm');
		});
	});

	router.get('/audition/confirm',function(req,res) {
		res.render('public/auditionConfirm');
	});

	router.get('/audition/error',function(req,res) {
		res.render('public/auditionError');
	});


	var sendEmail = function() {
		try {
			// create reusable transporter object using SMTP transport
			var transporter = nodemailer.createTransport(ses({
				region: 'us-west-2',
			    accessKeyId: 'AKIAI7C7AFSWTHGKREYA',
			    secretAccessKey: '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',
			    rateLimit: 5
			}));

			// NB! No need to recreate the transporter object. You can use
			// the same transporter object for all e-mails

			// setup e-mail data with unicode symbols
			var mailOptions = {
			    from: 'admin@lunchboxdc.me', // sender address
			    to: 'lunchboxdc@gmail.com', // list of receivers
			    subject: 'Test email', // Subject line
			    html: '<b>Html</b>' // html body
			};

			// send mail with defined transport object
			transporter.sendMail(mailOptions, function(error, info){
			    if(error){
			        console.log(error);
			    }else{
			        console.log('Message sent: ' + info.response);
			    }
			});
		} catch (e) {
			console.log(e);
			console.log(e.stack);
		}	
	}	


	return router;
})();