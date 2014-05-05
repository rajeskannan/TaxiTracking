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
app.use(express.favicon("public/img/taxifavicon.ico"));
app.use(express.logger('dev'));							    // log every request to the console
app.use(express.bodyParser());        					    // pull information from html in POST
app.use(express.methodOverride());

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));    // set the static files location /public/img will be /img for users


//....................................................//
app.use(function(req, res, next){
  console.log('normal middleware');
  res.status(404);
  
  // respond with html page
  if (req.accepts('html')) {
    res.render('404', { url: req.url });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});
app.use(function(err, req, res, next){
  console.log('ERROR middleware');
  res.status(err.status || 500);
  res.render('custom_error.html', { error: err });
});
//....................................................//

//render pages
var rendering=require('./render_pages/dynamic_pages');
//import User 
var User = require('./domain/User');
//import userController
var user_controller = require('./controller/user_controller');
//password module
var passwordModule = require('./controller/user_password_auth');
//import adminRoleManagement
var adminPermission = require('./config/adminRoleManagement');
//import tripTimeTrack_controller
var tripTimeTrack = require('./controller/tripTimeTrack_controller');


//default gateway
app.get('/',rendering.renderIndex);
app.get('/home',rendering.renderHome);
app.get('/contact',rendering.renderContact);
app.get('/about',rendering.renderAbout);
app.get('/userHome',user_controller.auth,rendering.renderUserHome);
app.get('/adminHome',user_controller.auth,adminPermission('ADMIN'),rendering.renderAdminHome);
app.post('/enqury',user_controller.enqurySave);
app.post('/saveUser',user_controller.saveNewUser);
app.post('/updateUser',user_controller.updateUser);
app.get('/userDetails',user_controller.getUserDetails);
//services for android app
app.get('/saveTripTime',tripTimeTrack.saveStartTripTimeDetails);
app.get('/userAuthValidation',user_controller.userAuthValid);




//login code
app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/', failureFlash: true }),
  function(req, res) {
    user_controller.getUserRole(req.user.id,function(role){
      req.session.role = role;
      if(role=='ADMIN'){
        res.redirect('/adminHome');
      }
      else{
        res.redirect('/userHome');
      }
      
    }); 
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // Find the user by username.  If there is no user with the given
      // username, or the password is not correct, set the user to `false` to
      // indicate failure and set a flash message.  Otherwise, return the
      // authenticated `user`.
      user_controller.findByUsername(username, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
        if (!passwordModule.validate(user.password,password)) { return done(null, false, { message: 'Invalid password' }); }
        return done(null, user);
      })
    });
  }
));



passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  user_controller.findById(id, function (err, user) {
    done(err, user);
  });
});

app.get('/logout', rendering.userLogout);


http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});