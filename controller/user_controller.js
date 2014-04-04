//Global variable
var connection = require('../config/db_util');
//import user module
var User = require('../domain/User');

//find user by id and userName
exports.findById=function findById(id, fn) {
  var query="select * from user where user_id=?";
  var user;
  connection.query(query ,[id], function(err, docs) {
	if(docs.length>0){
		user=new User(docs[0].user_id,docs[0].fisrt_name,docs[0].last_name,docs[0].username,docs[0].email,docs[0].password,docs[0].phone_number,docs[0].address,docs[0].company_id);
		fn(null, user);
	}
	else{
		fn(new Error('User ' + id + ' does not exist'));
	}
  });
};

exports.findByUsername=function findByUsername(username, fn) {
  var query="select * from user where username=?";
  var user;
  connection.query(query ,[username], function(err, docs) {
	if(docs.length>0){
		user=new User(docs[0].user_id,docs[0].fisrt_name,docs[0].last_name,docs[0].username,docs[0].email,docs[0].password,docs[0].phone_number,docs[0].address,docs[0].company_id);
		return fn(null, user);
	}
	else{
		return fn(null, null);
	}
  });
};

/*
 * check authentication
 */
exports.auth = function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
};