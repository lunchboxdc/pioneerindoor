const appConfig = require('../common/appConfig');
const mysql = require('promise-mysql');

let pool;

let mysqlOptions = {
    host: appConfig.piDbHost,
    user: appConfig.piDbUser,
    password: appConfig.piDbPass,
    database: 'pi',
    connectTimeout: 5000,
    connectionLimit: 10,
    dateStrings: ['DATE']
};

if (appConfig.nodeEnv === 'prod') {
  mysqlOptions.ssl = 'Amazon RDS';
}

module.exports = {

	open: function() {
		if (!pool) {
            pool = mysql.createPool(mysqlOptions);
            console.log('Mysql pool opened');
		}
	},

	close: function() {
		if (pool) {
            pool.end();
            console.log('Mysql pool closed');
		}
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
