'user strict';
var mongoose = require('mongoose');
var Rsvp = require('../models/rsvpSchema');

function rsvpCtrl() {
  
  this.addRsvp = function(req, res) {
    if (req.user) {
      var location = req.params.loc;
      var doc  = { business: location, user: req.user._id };
      var rsvp = new Rsvp(doc);
      rsvp.save(function(err, result) {
        if (err) { throw err; }
        res.json(result);
      });
    } else {
      res.sendStatus(401, 'User must be logged in to RSVP');
    }
  }
  
  this.deleteRsvp = function(req, res) {
    if (req.user) {
      var id = req.query.id;
      Rsvp.findOne({ _id: id }).populate('user')
      .exec(function(err, result) {
        if (err) { throw err; }
        if (result.user._id === req.user._id) {
          Rsvp.findOneAndUpdate({ _id: id }, { deletedAt: Date.now() }, { new: true }, function(err, result) {
            if (err) { throw err; }
            res.json(result);
          });
        } else {
          res.send(401, 'Unauthorized: User can only delete his/her own RSVPs');
        }
      })
    } else {
      res.send(401, 'User must be logged in to delete an RSVP');
    }
  };
  
  this.countRsvps = function(req, res) {
    var id = req.query.id;
    Rsvp.count({ business: id, deletedAt: { $exists: false }, createdAt:{$gt:new Date(Date.now() - 24*60*60 * 1000)} })
      .exec(function(err, count) {
        if (err) { throw err; }
        res.json(count);
      });
  };
  
  this.userRsvps = function(req, res) {
    if (req.user) {
      Rsvp.find({ user: req.user._id, deletedAt: { $exists: false } })
      .exec(function(err, result) {
        if (err) { throw err; }
        res.json(result);
      });
    } else {
      res.send(401, 'You must be logged in.');
    }    
  };
}

module.exports = rsvpCtrl;