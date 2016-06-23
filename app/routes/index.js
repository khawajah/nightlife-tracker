'use strict';

var yelp = require('../controllers/yelp.server');

var path = process.cwd();

module.exports = function (app, passport, db) {
	
	function ensureAuthenticated(req, res, next) {
  	if (req.isAuthenticated()) { return next(); }
	  res.send(401);
	}

	var Yelp = new yelp();
	
	function callback(error, response, body) {
	  console.log(body);
	}
	
	var params = {
	  location: 'Toronto, ON',
	}
	
	app.route('/')
		.get(function (req, res) {
			res.sendFile(path + '/public/index.html');
		});
	
	app.route('/yelp')
		.get(Yelp.search);
		
};