//Global variable
var connection = require('../config/db_util');


/*
 * Add a new company
*/
exports.saveNewComapany = function(req, res){
	var company_name = req.body.company_name;
	var address = req.body.address;
	var phone_no = req.body.phone_no;
	var website = req.body.website;
	var email = req.body.email;
	
	connection.query('INSERT INTO company (company_name,address,phone_no,website,email) VALUES (?,?,?,?,?);' , [company_name,address,phone_no,website,email], function(err, docs) {
		if(err) {console.log('err>> '+err);res.send(500);}
		res.redirect('/mainPage');
	});
};

/*
 * Redirect to a Edit company Page
*/
exports.editCompany = function(req, res){
	var company_id = req.param("companyId");
	
	connection.query('select * from company where company_id=?;' ,[company_id], function(err, docs) {
		res.render("editCompany",{companyInfo:docs});
	});
};

/*
 * update company information
*/

exports.updateCompany = function(req, res){
	var company_id = req.body.company_id;  //company Id in hidden field
	var company_name = req.body.company_name;
	var address = req.body.address;
	var phone_no = req.body.phone_no;
	var website = req.body.website;
	var email = req.body.email;
	
	connection.query('UPDATE company set company_name=? , address=? ,phone_no=?,website=?,email=? where company_id=?;' ,[company_name,address,phone_no,website,email,company_id], function(err, docs) {
		res.redirect('/comapnyPage');
	});
};


/*
 * delete a Company (whereever company_id is reffering in some table set every where on cascade delete)
*/
exports.deleteUser = function(req, res){
	var company_id = req.param("company_id");   //user id of the deleted user
	console.log('company_id>> '+company_id);
	connection.query('delete from company where company_id=?;' ,[company_id], function(err, docs) {
			if(err){console.log('err>> '+err);res.send('401');}
			res.redirect('/comapnyPage');
	});

};
