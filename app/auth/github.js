'use strict';
var passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy
var User = require('../models/userSchema');
var init = require('./init');


passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_ID || "0000000",
  clientSecret: process.env.GITHUB_SECRET || "000000000",
  callbackURL: process.env.GITHUB_CALLBACK || "http://test.com"
  },
  function(accessToken, refreshToken, profile, done) {
   process.nextTick(function() {
      // Find use if he exists, otherwise add him
      User.findOne({ socialId: profile.id,  socialSource: 'github'} , function(err, user) {
        if(err) {
          return done(err);
        }
        if (!user) {
          user = new User({
            avatar: profile._json.avatar_url,
            username: profile.username,
            socialId: profile.id,
            socialSource: 'github'
          });
          user.save(function(err) {
            if (err) console.log(err);
            return done(err, user);
          })
        } else {
          return done(null, user);
        }
      });
    });
  }
));

// serialize user into the session
init();

module.exports = passport;