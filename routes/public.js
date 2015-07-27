var express = require('express');
var path = require("path");
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
			res.redirect('/audition/confirm');
		});
	});

	router.get('/audition/confirm',function(req,res) {
		res.render('public/auditionConfirm');
	});

	router.get('/audition/error',function(req,res) {
		res.render('public/auditionError');
	});

	return router;
})();