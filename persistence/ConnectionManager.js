var mongoose = require('mongoose');
var mysql = require('promise-mysql');
var Assets = require('./models/Assets');
var Promise = require('bluebird');
var mongooseConnected = false;
var assetsVersion = 0;

var connection;
var mysqlConnected = false;
var pool;

mongoose.Promise = Promise;

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

            pool = mysql.createPool({
                host: 'localhost',
                user: process.env.PI_DB_USER,
                password: process.env.PI_DB_PASS,
                database: 'pi',
                connectionLimit: 10
            });

            console.log('Mysql pool opened');
		}
	},

	close: function() {
        mongoose.connection.close()
			.then(function () {
                mongooseConnected = false;
                console.info('Mongo connection closed');

                return pool.end();
            })
			.then(function() {
				mysqlConnected = false;
				console.info('Mysql pool closed');
			})
			.catch(function(e) {
				console.error(e);
			})
			.finally(function() {
				process.exit(0);
			});
	},

	getConnection: function() {
        return pool.getConnection().disposer(function(connection) {
            pool.releaseConnection(connection);
        });
	},

	isConnected: function() {
		return mongooseConnected;
	},

	getAssetsVersion: function() {
		return assetsVersion;
	}
};