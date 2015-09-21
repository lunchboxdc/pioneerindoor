var logger = require('./logger');

var configObject = {};
if(process.env.NODE_ENV === 'prod') {
	console.info('App running in prod mode');
	if(process.env.PORT) {
		configObject["port"] = process.env.PORT;
	}
    configObject["host"] = "https://www.pioneerindoordrums.org";
    configObject["logLevel"] = "debug";
} else {
    configObject["port"] = "3000";
    configObject["host"] = "http://localhost:"+configObject.port;
    configObject["logLevel"] = "debug";
}

console.info('App properties:\n', configObject);

if(configObject.logLevel) {
    logger.transports.console.level = configObject.logLevel;
}

module.exports = configObject;