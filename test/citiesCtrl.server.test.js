'use strict';
process.env.MONGODB_URI = "mongodb://localhost/nightlifeTracker"
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var server = require('../server');
var mongoose= require('mongoose');
var City = require('../app/controllers/cities.server')

chai.use(chaiHttp);

describe('CitiesCtrl', function() {
  describe('#topCities()', function() {
    it('should return the top cities', function(done) {
      chai.request(server)
        .get('/api/cities/top')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.an('object');
          res.body.should.have.property("Toronto")
          done();
        })
    })
  })
  
  describe('#recentCities()', function() {
    it('should return the 10 most recent searches', function(done) {
      chai.request(server)
        .get('/api/cities/recent')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.an('array');
          res.body.length.should.equal(10);
          done();
        })
    })
  })
  
  describe('#totalCities()', function() {
    it('should return the total number of searches', function(done) {
      chai.request(server)
        .get('/api/cities/count/total')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.have.property("count");
          res.body.should.be.an("object");
          done();
        })
    })    
  })
  
  describe('#weeklyCities()', function() {
    it('should return the number of searches in the last week', function(done) {
      chai.request(server)
        .get('/api/cities/count/week')
        .end(function(err, res) {
          should.not.exist(err);
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.have.property("count");
          res.body.should.be.an("object");
          done();
        })
    })    
  })
})