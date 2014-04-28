//Global variable
var connection = require('../config/db_util');
//import user module
var User = require('../domain/User');

//password module
var passwordModule = require('../controller/user_password_auth');

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
		user=new User(docs[0].user_id,docs[0].first_name,docs[0].last_name,docs[0].username,docs[0].email,docs[0].password,docs[0].phone_number,docs[0].address,docs[0].company_id);
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


/*
 * validation username of a newly created user
 */

exports.validateUserNameForUniqueness = function(req, res){

	var username = req.param("username");
	res.set('Content-Type', 'text/plain');
	connection.query('select * from user where username=?' ,[username], function(err, docs) {
		if(docs.length>0){
			res.write("true");
			res.end();
		}
		else{
			res.write("false");
			res.end();
		}
	});
};



/*
 * save new user information
 */
exports.saveNewUser = function(req, res){
	console.log(req.body);
	var first_name = req.body.first_name;
	var last_name = req.body.last_name;
	var username = req.body.username;
	var email = req.body.email;
	var address = req.body.address;
	var phone_no = req.body.phone_no;
	var password = passwordModule.hash(req.body.password);
	var date = new Date();

	connection.query('INSERT INTO user (first_name, last_name,username,email,password,created_on,updated_on,phone_number,address,company_id) VALUES (?,?,?,?,?,?,?,?,?,?);' , [first_name,last_name,username,email,password,date,date,phone_no,address,1], function(err, docs) {
		if(err) {console.log('err>> '+err);res.send('401');}
		findUserId(username, function(result_id) { 
			console.log('result_id>> '+result_id);
			connection.query('INSERT INTO user_role (user_id,role_id) VALUES (?,?)',[result_id,2], function(err, docs) {
				res.redirect('/userHome');
			});
		});
			
	});
};


//find id for a specific user
function findUserId(username,calfn){
  var query="select user_id from user where username=?";
  var result;
  connection.query(query ,[username], function(err, docs) {
	if(docs.length>0){
		result = docs[0].user_id;
		return calfn(result);
	}
	else{
		return calfn(null);
	}
  });
};

/*
 * Redirect to a Edit User Page
 */
exports.editUser = function(req, res){
	var user_id = req.param("userId");
	var query = "select * from user where user_id=?"
	
	if(user_id){
		connection.query(query ,[user_id], function(err, docs) {
			if(err){console.log('err>> '+err);res.send('401');}
			res.render("editUserPage",{user:docs});
		});
	
	}
	else{
		console.log('userId is misisng!');
		res.send('401');
	}
};
/*
 * update user information
 */
 exports.updateUser = function(req, res){
	var user_id = req.body.user_id;   //hidden id of the user in the form
	var first_name = req.body.first_name;
	var last_name = req.body.last_name;
	var email = req.body.email;
	var address = req.body.address;
	var phone_number = req.body.phone_number;
	var date = new Date();

	connection.query('UPDATE user set first_name=? , last_name=? ,email=?,address=?,phone_number=?,updated_on=? where user_id=?;' ,[first_name,last_name,email,address,phone_number,date,user_id], function(err, docs) {
		console.log(err);
		res.redirect('/userHome');
	});

};


/*
 * delete a User (whereever user_id is reffering in some table set every where on cascade delete)
 */
exports.deleteUser = function(req, res){
	var user_id = req.param("userId");   //user id of the deleted user
	console.log('user_id>> '+user_id);
	connection.query('delete from user where user_id=?;' ,[user_id], function(err, docs) {
			if(err){console.log('err>> '+err);res.send('401');}
			res.redirect('/userHome');
	});

};
 
/*
 * view a user information
 */
exports.viewUser = function(req, res){
	var user_id = req.param("userId");
	var query = "select * from user where user_id=?"
	
	if(user_id){
		connection.query(query ,[user_id], function(err, docs) {
			if(err){console.log('err>> '+err);res.send('401');}
			res.render("viewUserPage",{user:docs});
		});
	
	}
	else{
		console.log('userId is misisng!');
		res.send('401');
	}
};
 
 
 
//save enquiry 
exports.enqurySave =function(req,res){
	var name = req.body.name;
	var company_name = req.body.company;
	var email = req.body.email;
	var phone_no = req.body.phone;
	var comment = req.body.comment;
	var date = new Date();
	
	connection.query('INSERT INTO enquiry (name,company_name,email,phone_no,comments,created_on) VALUES (?,?,?,?,?,?);' , [name,company_name,email,phone_no,comment,date], function(err, docs) {
		if(err) {console.log('err>> '+err);req.session.error="Some problem occoured!";res.redirect('#/contact');}
		else{res.redirect('#/contact');}
	});
	
};

/*
 * get user info
 */
function getUserInfo(userId,calfn){
	var user;
	connection.query('select * from user where user_id=?',[userId], function(err, docs) {
			if(err){console.log('err>> '+err);calfn(null);}
			else{
				calfn(docs);
			}
		});
 };

exports.getUserDetails = function(req,res){
	res.set('Content-Type', 'application/json');
	getUserInfo(req.user.id,function(userInfo){
		res.write(JSON.stringify(userInfo));
		res.end();
	});

};