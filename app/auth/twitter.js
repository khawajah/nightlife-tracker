var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var User = require('../models/userSchema');
var init = require('./init');

passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: process.env.TWIITER_CALLBACK
  },
  function(token, tokenSecret, profile, done) {
    process.nextTick(function() {
      // Find use if he exists, otherwise add him
      User.findOne({ socialId: profile.id, socialSource: 'twitter' }, function(err, user) {
        if(err) {
          return done(err);
        }
        if (!user) {
          user = new User({
            avatar: profile.photos[0].value,
            username: profile.username,
            socialId: profile.id,
            socialSource: 'twitter'
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