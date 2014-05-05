//Global variable
var connection = require('../config/db_util');

/*
 * save start trip time
 */
function saveStartTripTime(driver_id,status,dispatcher_id,start_time,calfn){
	connection.query('INSERT INTO trip_activity (driver_id, status,dispatcher_id,start_time) VALUES (?,?,?,?);' , [driver_id,status,dispatcher_id,start_time], function(err, docs) {
			if(err){console.log('err>> '+err);calfn(null);}
			else{
				calfn("true");
			}
		});
 };


function saveEndTripTime(id,end_time,calfn){
	connection.query('UPDATE trip_activity set end_time=? where id=?;' , [id,end_time], function(err, docs) {
			if(err){console.log('err>> '+err);calfn(null);}
			else{
				calfn("true");
			}
		});
 };





exports.saveStartTripTimeDetails = function(req,res){

	res.set('Content-Type', 'application/json');
	var end_time = req.param("end_time");
	if(end_time){
		
		var id = req.param("trip_activity_id");
		end_time = new Date(end_time);
		saveEndTripTime(id,end_time,function(result){
			res.write(JSON.stringify(result));
			res.end();
		});
	}
	else{

		var driver_id = req.param("driver_id");
		var status = req.param("statusMessage");
		var dispatcher_id = req.param("dispatcher_id");
		var start_time;
		start_time = req.param("start_time");
		if(start_time){
			start_time = new Date(start_time);
			console.log("start_time>> "+start_time);
		}
		else {start_time = new Date();}
		saveStartTripTime(driver_id,status,dispatcher_id,start_time,function(result){
			res.write(JSON.stringify(result));
			res.end();
		});
	}

};


