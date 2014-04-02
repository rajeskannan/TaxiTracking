#!/usr/bin/env node

var express = require('express'),
	path = require('path'),
	engine = require('ejs-locals');

var util = require('util'),
	http = require('http'),
	fs = require('fs'),
	url = require('url'),
	events = require('events');
var flash = require('connect-flash');

//create app
var app = express();
app.engine('html', engine);

//add passport
app.use(express.cookieParser()); 
app.use(express.session({ secret: 'keyboard cat' }));
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//connect to mysql database
var connection = require('./config/db_util');

// all environments
app.set('port', process.env.PORT || 8000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');						        //ejs engine for view 
app.use(express.favicon("public/img/favicon.ico"));
app.use(express.logger('dev'));							    // log every request to the console
app.use(express.bodyParser());        					    // pull information from html in POST
app.use(express.methodOverride());

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));    // set the static files location /public/img will be /img for users


//default gateway
app.get('/',function( req, res) {
	res.render('index.html');
});

app.get('/home',function( req, res) {
	res.render('home.html');
});

app.get('/contact',function( req, res) {
	res.render('contact.html');
});

app.get('/about',function( req, res) {
	res.render('about.html');
});

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});