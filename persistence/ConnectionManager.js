var mysql = require('promise-mysql');

var pool;

var mysqlOptions = {
    host: process.env.PI_DB_HOST,
    user: process.env.PI_DB_USER,
    password: process.env.PI_DB_PASS,
    database: 'pi',
    connectionLimit: 100,
    dateStrings: ['DATE']
};

// if (process.env.PI_DB_HOST.includes('rds.amazonaws.com')) {
// 	mysqlOptions['ssl'] = 'Amazon RDS';
// }

module.exports = {

	open: function() {
		if (!pool) {
            pool = mysql.createPool(mysqlOptions);
            console.log('Mysql pool opened');
		}
	},

	close: function() {
        pool.end();
	},

	getConnection: function() {
        return pool.getConnection().disposer(function(connection) {
        	pool.releaseConnection(connection);
        });
	},

	query: function(query, arguments) {
		return pool.query(query, arguments);
	}
};