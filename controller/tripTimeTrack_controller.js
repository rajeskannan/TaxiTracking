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

exports.saveStartTripTimeDetails = function(req,res){
	var driver_id = req.param("driver_id");
	var status = req.param("statusMessage");
	var dispatcher_id = req.param("dispatcher_id");
	var start_time;
	start_time = req.param("start_time");
	if(start_time){
		console.log("start_time>> "+start_time);
	}
	else {start_time = new Date();}
	res.set('Content-Type', 'application/json');
	getUserInfo(driver_id,status,dispatcher_id,start_time,function(result){
		res.write(JSON.stringify(result));
		res.end();
	});

};

