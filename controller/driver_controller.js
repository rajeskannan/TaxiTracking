//Global variable
var connection = require('../config/db_util');

/*
 * Create a new Driver
*/
exports.saveNewDriver = function(req, res){
	var first_name = req.body.first_name;
	var last_name = req.body.last_name;
	var company_id = req.body.company_id;
	var phone_number = req.body.phone_number;
	var vehicle_id = req.body.vehicle_id;
	
	connection.query('INSERT INTO driver (first_name,last_name,company_id,phone_number,vehicle_id) VALUES (?,?,?,?,?);' , [first_name,last_name,company_id,phone_number,vehicle_id], function(err, docs) {
		if(err) {console.log('err>> '+err);res.send(500);}
		res.redirect('/driverPage');
	});
};

/*
 * update driver information
*/
exports.updateDriver = function(req, res){
	var driver_id = req.body.driver_id;
	var first_name = req.body.first_name;
	var last_name = req.body.last_name;
	var phone_number = req.body.phone_number;
	var vehicle_id = req.body.vehicle_id;
	
	connection.query('UPDATE driver set first_name=? , last_name=? ,phone_number=? ,vehicle_id=? where driver_id=?;' ,[first_name,last_name,phone_number,vehicle_id,driver_id], function(err, docs) {
		res.redirect('/driverPage');
	});
};

/*
 * view a driver information
*/
function getDriverInfo(driverId,calfn){
	connection.query('select * from driver where driver_id=?',[driverId], function(err, docs) {
			if(err){console.log('err>> '+err);calfn(null);}
			else{
				calfn(docs);
			}
		});
 };

exports.getDriverDetails = function(req,res){
	var driver_id = req.body.driver_id;

	res.set('Content-Type', 'application/json');
	getDriverInfo(driver_id,function(driverInfo){
		res.write(JSON.stringify(userInfo));
		res.end();
	});

};


/*
 * delete a driver information
*/

exports.deleteDriverDetails = function(req,res){
	var driver_id = req.body.driver_id;

	deleteDriverFromUnavailTable(driver_id,function(status){
		deleteDriverFromTripActTable(driver_id,function(status){

			connection.query('delete from driver where driver_id=?',[driverId], function(err, docs) {
				if(err){console.log('err>> '+err);}
				else{
					res.redirect('/driverPage');
				}
			});

		});
	});

};


function deleteDriverFromUnavailTable(driverId,calfn){
	var status = false;
	connection.query('delete from driver_unavailibilty where driver_id=?',[driverId], function(err, docs) {
			if(err){console.log('err>> '+err);calfn(status);}
			else{
				status = true;
				calfn(status);
			}
		});
 };

 function deleteDriverFromTripActTable(driverId,calfn){
	var status = false;
	connection.query('delete from trip_activity where driver_id=?',[driverId], function(err, docs) {
			if(err){console.log('err>> '+err);calfn(status);}
			else{
				status = true;
				calfn(status);
			}
		});
 };