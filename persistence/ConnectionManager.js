var Promise = require('bluebird');
var mongoose = require('mongoose');
var mysql = require('promise-mysql');
var Assets = require('./models/Assets');

var mongooseConnected = false;
var assetsVersion = 0;
var mysqlConnected = false;
var pool;

mongoose.Promise = Promise;

var mysqlOptions = {
    host: '127.0.0.1',
    user: process.env.PI_DB_USER,
    password: process.env.PI_DB_PASS,
    database: 'pi',
    connectionLimit: 100,
    dateStrings: ['DATE']
};

var openConnectionPool = function() {
    return new Promise(function(resolve, reject) {
        try {
            pool = mysql.createPool(mysqlOptions);
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {

	open: function() {
		if (!mongooseConnected) {
			try {
				mongoose.connect('mongodb://localhost/pi');
				mongoose.connection.on("open", function() {
					console.info('Mongo connection opened');
					mongooseConnected = true;
					Assets.findOne(function (err, assets) {
						if (err) {
							console.error('error getting assets version!' + err);
						} else {
							if (!assets) {
								assets = new Assets();
								assets.version = 0;
							} else {
								assets.version++;
							}

							assets.save(function (err, assets) {
								if (err) {
									console.log('error saving assets version: ' + err);
								} else {
									assetsVersion = assets.version;
								}
							});
						}
					});
				});

				mongoose.connection.on('error',function (e) {
					console.error('failed to connect to database' + e);
				});
			} catch (e) {
				console.error('failed to connect to database' + e);
			}

			// mysql.createConnection({
			// 		host: 'localhost',
			// 		user: process.env.PI_DB_USER,
			// 		password: process.env.PI_DB_PASS,
			// 		database: 'pi'
			// 	})
			// 	.then(function(conn) {
			// 		connection = conn;
             //        mysqlConnected = true;
             //        console.log('Mysql connection opened');
			// 	})
			// 	.catch(function(e) {
             //        console.log('Error connecting to database', e);
			// 	});

            pool = mysql.createPool(mysqlOptions);

            console.log('Mysql pool opened');
		}
	},


	openTest: function() {
        var tasks = [];

        if (!mongooseConnected) {
            tasks.push(mongoose.connect('mongodb://localhost/pi'));
        }
        if (!pool) {
            tasks.push(openConnectionPool());
        }

        return Promise.all(tasks)
			.then(function() {
                mongooseConnected = false;
                mysqlConnected = false;
                console.info('Database connections opened');
			});
	},


	close: function() {
		var tasks = [];

		if (mongooseConnected) {
			tasks.push(mongoose.connection.close());
		}
		if (pool) {
			tasks.push(pool.end());
		}

		return Promise.all(tasks)
			.then(function() {
				mongooseConnected = false;
				mysqlConnected = false;
				console.info('Database connections closed');
			});
	},

	getConnection: function() {
        return pool.getConnection().disposer(function(connection) {
        	pool.releaseConnection(connection);
        });
	},

	query: function(query, arguments) {
		return pool.query(query, arguments);
	},

	isConnected: function() {
		return mongooseConnected;
	},

	getAssetsVersion: function() {
		return assetsVersion;
	}
};