/* require the modules needed */
var oauthSignature = require('oauth-signature');  
var n = require('nonce')();  
var request = require('request');  
var qs = require('querystring');  
var _ = require('lodash');

var mongoose = require('mongoose');
var City = require('../models/citySchema');

// Yelp API code courtesy https://arian.io/how-to-use-yelps-api-with-node/

/* Function for yelp call
 * ------------------------
 * set_parameters: object with params to search
 * callback: callback(error, response, body)
 */
var request_yelp = function(set_parameters, type, callback) {

  /* The type of request */
  var httpMethod = 'GET';

  /* The url we are using for the request */
  if (type === 'search') {
    var url = 'http://api.yelp.com/v2/search';
  } else if  (type === 'business') {
    var url = 'http://api.yelp.com/v2/business/' + set_parameters.id;
  }

  /* We set the require parameters here */
  var required_parameters = {
    oauth_consumer_key : process.env.YELP_CONSUMER_KEY,
    oauth_token : process.env.YELP_TOKEN,
    oauth_nonce : n(),
    oauth_timestamp : n().toString().substr(0,10),
    oauth_signature_method : 'HMAC-SHA1',
    oauth_version : '1.0'
  };

  /* We combine all the parameters in order of importance */ 
  if (type === 'search') {
    var parameters = _.assign(set_parameters, required_parameters);
  } else if (type === 'business') {
    var parameters = _.assign(required_parameters);
  }
  
  /* We set our secrets here */
  var consumerSecret = process.env.YELP_CONSUMER_SECRET;
  var tokenSecret = process.env.YELP_TOKEN_SECRET;

  /* Then we call Yelp's Oauth 1.0a server, and it returns a signature */
  /* Note: This signature is only good for 300 seconds after the oauth_timestamp */
  var signature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret, { encodeSignature: false});

  /* We add the signature to the list of paramters */
  parameters.oauth_signature = signature;

  /* Then we turn the paramters object, to a query string */
  
  var paramURL = qs.stringify(parameters);

  /* Add the query string to the url */
  var apiURL = url+'?'+paramURL;
 
  /* Then we use request to send make the API Request */
  request(apiURL, function(error, response, body){
    return callback(error, response, body);
  });

};

function yelp() {
  
  this.search = function(req, res) {
    
    var searchLocation = req.query.q;
    var doc = { city: searchLocation }
    var city = new City(doc);
    city.save(function(err, result) {
      if (err) { throw err; }
    });
    req.session.lastSearch = searchLocation;
    
    function callback(error, response, body) {
      var data = JSON.parse(body);
      var businesses = data.businesses;
      res.json(businesses);
    }
    
    var params = {
      location: searchLocation,
      category_filter: 'nightlife',
      sort: '1'
    }; 
  
    request_yelp(params, 'search', callback);
  };
  
  this.getById = function(req, res) {
    var businessId = req.params.business;
    
    function callback(error, response, body) {
      var data = JSON.parse(body);
      res.json(data);
    }
    
    var params = { 
      id: businessId
    };
    
    request_yelp(params, 'business', callback);
  }
}

module.exports = yelp;