'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');
var fs = require('fs');
var session = require('express-session');
var bodyParser = require('body-parser');
var passport = require('passport');

var app = express();
var server;
mongoose.connect(process.env.MONGODB_URI);

//var db = mongoose.connection;

//db.on('error', console.error.bind(console, 'connection error:'));
//db.once('open', function() {

fs.readdirSync(process.cwd() + '/app/models').forEach(function(filename) {
  require(process.cwd() + '/app/models/' + filename);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/node_modules', express.static(process.cwd() + '/node_modules'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/views', express.static(process.cwd() + '/views'));

app.use(session({
	secret: 'secretLukeyDukey',
	resave: false,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

routes(app, passport);

var port = process.env.PORT || 8080;
server = app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});

module.exports = server;