//Global variable
var connection = require('../config/db_util');

/*
 * Create a new Vehicle
*/
exports.saveNewVehicle = function(req, res){
	var vehicle_type = req.body.vehicle_type;
	var vehicle_number = req.body.vehicle_number;
	var registration_number = req.body.registration_number;
	var company_id = req.body.company_id;

	connection.query('INSERT INTO vehicle (vehicle_type,vehicle_number,registration_number,company_id) VALUES (?,?,?,?);' , [vehicle_type,vehicle_number,registration_number,company_id], function(err, docs) {
		if(err) {console.log('err>> '+err);res.send(500);}
		res.redirect('/vehiclePage');
	});
};

/*
 * update vehicle information
*/
exports.updateVehicle = function(req, res){
	var vehicle_id = req.body.vehicle_id;
	var vehicle_type = req.body.vehicle_type;
	var vehicle_number = req.body.vehicle_number;
	var registration_number = req.body.registration_number;
	var company_id = req.body.company_id;
	
	connection.query('UPDATE vehicle set vehicle_type=? , vehicle_number=? ,registration_number=? ,company_id=? where vehicle_id=?;' ,[vehicle_type,vehicle_number,registration_number,company_id,vehicle_id], function(err, docs) {
		res.redirect('/vehiclePage');
	});
};

/*
 * view a vehicle information
*/
function getVehicleInfo(vehicleId,calfn){
	connection.query('select * from vehicle where vehicle_id=?',[vehicleId], function(err, docs) {
			if(err){console.log('err>> '+err);calfn(null);}
			else{
				calfn(docs);
			}
		});
 };

exports.getVehicleDetails = function(req,res){
	var vehicle_id = req.body.vehicle_id;

	res.set('Content-Type', 'application/json');
	getDriverInfo(vehicle_id,function(vehicleInfo){
		res.write(JSON.stringify(vehicleInfo));
		res.end();
	});

};