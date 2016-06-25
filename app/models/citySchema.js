'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create User Schema
var citySchema = new Schema({
  city: String
}, { timestamps: true
});


module.exports = mongoose.model('City', citySchema);