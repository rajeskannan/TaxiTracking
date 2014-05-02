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
	var driver_id = req.body.driver_id;
	var status = req.body.status;
	var dispatcher_id = req.body.dispatcher_id;
	var start_time = new Date();
	res.set('Content-Type', 'application/json');
	getUserInfo(driver_id,status,dispatcher_id,start_time,function(result){
		res.write(JSON.stringify(result));
		res.end();
	});

};

