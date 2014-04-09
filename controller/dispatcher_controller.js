//Global variable
var connection = require('../config/db_util');


/*
 * Add a new Dispatcher
*/
exports.saveNewDispatcher = function (req,res) {
	var company_id = req.user.company_id;
	var created_by = req.user.id;
	var updated_by = req.user.id;
	var vehicle_id = req.body.vehicle_id;
	var status = "";
	var remarks = req.body.remarks;
	var reference_number = req.body.reference_number;

	var date = new Date();

	connection.query('INSERT INTO dispatcher (company_id,vehicle_id,status,remarks,created_on,updated_on,created_by,updated_by,reference_number) VALUES (?,?,?,?,?,?,?,?,?);' , [company_id,vehicle_id,status,remarks,date,date,created_by,updated_by,reference_number], function(err, docs) {
		if(err) {console.log('err>> '+err);res.send(500);}
		res.redirect('/dispatcherPage');
	});


};

/*
 * Redirect to a Edit dispatcher Page
*/

exports.editDispatcher = function (req,res) {

	var dispatcher_id = req.param("dispatcher_id");

	connection.query('select * from dispatcher where dispatcher_id=?;' ,[dispatcher_id], function(err, docs) {
		if(err) {console.log('err>> '+err);res.send(500);}
		res.render("editDispatcher",{dispatcherInfo:docs});
	});

};


/*
 * update dispatcher information
*/
exports.updateDispatcher = function(req, res){

	var dispatcher_id = req.body.dispatcher_id;

	var updated_by = req.user.id;
	var vehicle_id = req.body.vehicle_id;
	var status = "";
	var remarks = req.body.remarks;
	var reference_number = req.body.reference_number;

	var date = new Date();
	
	connection.query('UPDATE dispatcher set vehicle_id=? , status=? ,remarks=?,updated_on=?,updated_by=?,reference_number=? where dispatcher_id=?;' ,[vehicle_id,status,remarks,date,updated_by,reference_number,dispatcher_id], function(err, docs) {
		if(err) {console.log('err>> '+err);res.send(500);}
		res.redirect('/dispatcherPage');
	});
};

/*
 * delete dispatcher information
*/

exports.deleteDispatcher = function(req,res){

	var dispatcher_id = req.param("dispatcher_id");

	connection.query('delete from dispatcher where dispatcher_id=?;' ,[dispatcher_id], function(err, docs) {
		if(err) {console.log('err>> '+err);res.send(500);}
		res.redirect('/dispatcherPage');
	});
};