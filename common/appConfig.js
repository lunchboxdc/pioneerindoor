var logger = require('./logger');
var moment = require('moment');

const auditionDate = '2017-11-04 08:00';

var config = {
    auditionDate: moment(auditionDate),
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT,
    piSessionSecret: process.env.PI_SESSION_SECRET,
    fbToken: process.env.FB_TOKEN,
    piAccessKeyId: process.env.PI_ACCESS_KEY_ID,
    piSecretAccessKey: process.env.PI_SECRET_ACCESS_KEY,
    piDbHost: process.env.PI_DB_HOST,
    piDbUser: process.env.PI_DB_USER,
    piDbPass: process.env.PI_DB_PASS,
    piDbSslCa: process.env.PI_DB_SSL_CA
};


if (config.nodeEnv === 'prod') {
	console.info('App running in prod mode');
    config['host'] = 'https://www.pioneerindoordrums.org';
    config['logLevel'] = 'info';
} else {
    config['port'] = '3000';
    config['host'] = 'http://localhost:' + config.port;
    config['logLevel'] = 'debug';
}


if (config.logLevel) {
    logger.transports.console.level = config.logLevel;
}


console.info('App properties:\n', config);
module.exports = config;