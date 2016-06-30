'use strict';
var mongoose = require('mongoose');
var City = require('../models/citySchema');

function citiesCtrl() {

  this.topCities = function (req, res) {
    var cityArray = [];
    var cityCounts = {};
    City.find().exec(function(err, result) {
      if (err) { throw result; }
      result.forEach(function(city) {
        cityArray.push(city.city);
      });
      cityArray.forEach(function(city) {
        city = city.toUpperCase();
        if (cityCounts.hasOwnProperty(city)) {
          cityCounts[city]++;
        } else {
          cityCounts[city] = 1;
        }
      });
      res.json(cityCounts);
    })
  }
  
  this.recentCities = function(req, res) {
    City.find().limit(10).sort([['updatedAt', 'descending']]).exec(function(err, result) {
      if (err) { throw err; }
      res.json(result);
    });
  }

  this.totalCities = function(req, res) {
    City.count().exec(function(err, count) {
      if (err) { throw err; }
      res.json({"count": count});
    });
  }
  
  this.weeklyCities = function(req, res) {
    City.count({ createdAt: { $gt: new Date(Date.now() - 7*24*60*60*1000) } })
    .exec(function(err, count) {
      if (err) { throw err; }
      res.json({"count": count});
    });
  }
};

module.exports = citiesCtrl;
