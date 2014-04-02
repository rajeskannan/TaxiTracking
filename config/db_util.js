var client = module.exports = require('mysql').createConnection({
	host: 'localhost',
    user:  'root',
    password: 'admin',
    database: 'taxitracker',
});
client.connect();