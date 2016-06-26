'use strict';

var yelp = require('../controllers/yelp.server');
var userCtrl = require('../controllers/user.server');
var rsvpCtrl = require('../controllers/rsvp.server');

var path = process.cwd();
var passportGithub = require('../auth/github');
var passportTwitter = require('../auth/twitter');

module.exports = function (app, passport, db) {

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
	
	app.route('/yelp/:business')
		.get(Yelp.getById);
		
	app.route('/api/getLastSearch')
		.get(UserCtrl.getLastSearch);
	
	// RSVP Routes
	app.route('/api/rsvp')
		.post(RsvpCtrl.addRsvp);
	
	app.route('/api/rsvp/delete')
		.get(RsvpCtrl.deleteRsvp);
		
	app.route('/api/currentrsvp/delete')
		.get(RsvpCtrl.deleteCurrentRsvp);
		
	app.route('/api/rsvp/:loc/count')
		.get(RsvpCtrl.countRsvps);
		
	app.route('/api/userrsvphistory')
		.get(RsvpCtrl.userRsvpHistory);
	
	app.route('/api/userrsvpactivity')
		.get(RsvpCtrl.userRsvpActivity);
		
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
		.get(passportGithub.authenticate('github', {successRedirect: '/', failureRedirect: '/#login' }));
	
	app.route('/auth/twitter')
		.get(passportTwitter.authenticate('twitter'));
		
	app.route('/auth/twitter/callback')
		.get(passportTwitter.authenticate('twitter', {successRedirect: '/', failureRedirect: '/#login' }));
};