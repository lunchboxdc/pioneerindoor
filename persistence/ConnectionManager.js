var appConfig = require('../common/appConfig');
var mysql = require('promise-mysql');
var fs = require('fs');

var pool;

var mysqlOptions = {
    host: appConfig.piDbHost,
    user: appConfig.piDbUser,
    password: appConfig.piDbPass,
    database: 'pi',
    connectionLimit: 100,
    dateStrings: ['DATE']
};

if (appConfig.piDbSslCa) {
    mysqlOptions['ssl'] = {};
	mysqlOptions.ssl['ca'] = fs.readFileSync(appConfig.piDbSslCa);
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