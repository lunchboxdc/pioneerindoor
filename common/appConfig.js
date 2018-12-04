const moment = require('moment');

const auditionDate = '2017-11-04 08:00';

const piSessionSecret = process.env.PI_SESSION_SECRET ? process.env.PI_SESSION_SECRET : "strictlyForNonProductionUse";

var config = {
	auditionDate: moment(auditionDate),
	nodeEnv: process.env.NODE_ENV,
	nodePort: process.env.NODE_PORT,
	piSessionSecret: piSessionSecret,
	fbToken: process.env.FB_TOKEN,
	piAccessKeyId: process.env.PI_ACCESS_KEY_ID,
	piSecretAccessKey: process.env.PI_SECRET_ACCESS_KEY,
	piDbHost: process.env.DB_HOST,
	piDbUser: process.env.DB_USER,
	piDbPass: process.env.DB_PASS,
	dbSslCaCert: process.env.DB_SSL_CA_CERT
};


if (config.nodeEnv === 'prod') {
	console.info('App running in prod mode');
	config['host'] = 'https://www.pipercussion.org';
	config['logLevel'] = 'info';
} else {
	config['port'] = '3002';
	config['host'] = 'http://localhost:' + config.nodePort;
	config['logLevel'] = 'debug';
}

module.exports = config;
