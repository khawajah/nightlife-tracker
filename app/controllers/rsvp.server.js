'user strict';
var mongoose = require('mongoose');
var Rsvp = require('../models/rsvpSchema');

function rsvpCtrl() {
  
  this.addRsvp = function(req, res) {
    if (req.user) {
      var business = req.body.business;
      var businessId = req.body.businessId;
      var businessUrl = req.body.businessUrl;
      var doc  = { business: business, businessId: businessId, businessUrl: businessUrl, user: req.user._id };
      var rsvp = new Rsvp(doc);
      rsvp.save(function(err, result) {
        if (err) { throw err; }
        res.json(result);
      });
    } else {
      res.sendStatus(401);
    }
  }
  
  this.deleteCurrentRsvp = function(req, res) {
    if (req.user) {
      var business = req.query.b;
      Rsvp.findOneAndUpdate({ business: business, user: req.user, createdAt: {$gt:new Date(Date.now() - 24*60*60*1000)} }, { deletedAt: Date.now() }, { new: true }, function(err, result) {
        if (err) { throw err; }
        res.json(result);
      });
    } else {
      res.sendStatus(401);
    }
  }
  
  this.deleteRsvp = function(req, res) {
    if (req.user) {
      var id = req.query.id;
      var date = req.query.date;
      Rsvp.findOneAndUpdate({ businessId: id, createdAt: date, user: req.user  }, { deletedAt: Date.now() }, { new: true }, function(err, result) {
        if (err) { throw err; }
        res.json(result);
      });
    } else {
      res.sendStatus(401);
    }
  };
  
  this.countRsvps = function(req, res) {
    var id = req.params.loc;
    Rsvp.count({ businessId: id, deletedAt: { $exists: false }, createdAt:{$gt:new Date(Date.now() - 24*60*60 * 1000)} })
      .exec(function(err, count) {
        if (err) { throw err; }
        res.json(count);
      });
  };
  
  this.userRsvpHistory = function(req, res) {
    if (req.user) {
      Rsvp.find({ user: req.user._id, deletedAt: { $exists: false }, createdAt:{$lt:new Date(Date.now() - 24*60*60*1000)} })
      .exec(function(err, result) {
        if (err) { throw err; }
        res.json(result);
      });
    }    
  };
  
  this.userRsvpActivity = function(req, res) {
    if (req.user) {
      Rsvp.find({ user: req.user._id, deletedAt: { $exists: false }, createdAt:{$gt:new Date(Date.now() - 24*60*60*1000)} })
      .exec(function(err, result) {
        if (err) { throw err; }
        res.json(result);
      });
    }    
  };
}

module.exports = rsvpCtrl;