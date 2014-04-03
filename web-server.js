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
app.set('view engine', 'ejs');								//ejs engine for view 
app.use(express.favicon("public/img/favicon.ico"));
app.use(express.logger('dev'));								// log every request to the console
app.use(express.bodyParser());								// pull information from html in POST
app.use(express.methodOverride());

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));	// set the static files location /public/img will be /img for users

//render pages
var rendering=require('./render_pages/dynamic_pages');
//import User 
var User = require('./domain/User');
//import userController
var user_controller = require('./controller/user_controller');
//default gateway
app.get('/',rendering.renderIndex);
app.get('/home',rendering.renderHome);
app.get('/contact',rendering.renderContact);
app.get('/about',rendering.renderAbout);
app.get('/userHome',ensureAuthenticated,rendering.renderUserHome);
app.get('/invalid',rendering.renderInvalid);

//login code
app.post('/login', passport.authenticate('local', { failureRedirect: '/', failureFlash: true }),
	function(req, res) {
		res.redirect('/userHome');
	}
);

passport.use(new LocalStrategy(function(username, password, done) {
	// asynchronous verification, for effect...
	process.nextTick(function () {

	// Find the user by username.  If there is no user with the given
	// username, or the password is not correct, set the user to `false` to
	// indicate failure and set a flash message.  Otherwise, return the
	// authenticated `user`.
		user_controller.findByUsername(username, function(err, user) {
			if (err) { return done(err); }
			if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
			if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
			return done(null, user);
		});
	});
}));



passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	user_controller.findById(id, function (err, user) {
		done(err, user);
	});
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}

function disableLoginPage(req, res, next){
	if (req.isAuthenticated()) {res.redirect('/index'); }
	return next();
}


app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});


http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});