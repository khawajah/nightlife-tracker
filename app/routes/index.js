'use strict';

var yelp = require('../controllers/yelp.server');
var userCtrl = require('../controllers/user.server');
var rsvpCtrl = require('../controllers/rsvp.server');

var path = process.cwd();
var passportGithub = require('../auth/github');
var passportTwitter = require('../auth/twitter');

module.exports = function (app, passport, db) {
	
	function ensureAuthenticated(req, res, next) {
  	if (req.isAuthenticated()) { return next(); }
	  res.send(401);
	}

	var Yelp = new yelp();
	var UserCtrl = new userCtrl();
	var RsvpCtrl = new rsvpCtrl();
	
	// Primary route
	app.route('/')
		.get(function (req, res) {
			res.sendFile(path + '/public/index.html');
		});
	
	// Search related routes
	app.route('/yelp')
		.get(Yelp.search);
	
	app.route('/api/getLastSearch')
		.get(UserCtrl.getLastSearch);
	
	// RSVP Routes
	app.route('/api/rsvp/:loc')
		.get(RsvpCtrl.addRsvp);
	
	app.route('/api/rsvp/delete')
		.get(RsvpCtrl.deleteRsvp);
		
	app.route('/api/rsvp/:loc/count')
		.get(RsvpCtrl.countRsvps);
		
	app.route('/api/userrsvps')
		.get(RsvpCtrl.userRsvps);
	
	// Authentication routes
	app.route('/logout')
		.get(function(req, res) {
			req.session.lastSearch = null;
			req.logout();
			res.redirect('/');
		});
		
	app.route('/api/getCurrentUser')
		.get(UserCtrl.getCurrentUser);

	app.route('/auth/github')
		.get(passportGithub.authenticate('github', {scope: [ 'user' ] }));
		
	app.route('/auth/github/callback')
		.get(passportGithub.authenticate('github', {successRedirect: '/#searchresul', failureRedirect: '/#login' }));
	
	app.route('/auth/twitter')
		.get(passportTwitter.authenticate('twitter'));
		
	app.route('/auth/twtter/callback')
		.get(passportTwitter.authenticate('twitter', {successRedirect: '/', failureRedirect: '/#login' }));
	
};