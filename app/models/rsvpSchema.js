'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create User Schema
var rsvpSchema = new Schema({
  business: String,
  businessId: String,
  businessUrl: String,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  deletedAt: Date
}, { timestamps: true
});


module.exports = mongoose.model('Rsvp', rsvpSchema);