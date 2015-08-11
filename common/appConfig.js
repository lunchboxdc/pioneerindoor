var logger = require('./logger');

var configObject = {};
if(process.env.NODE_ENV === 'prod') {
    configObject["host"] = "https://www.lunchboxdc.me";
    configObject["logLevel"] = "error";
} else {
    configObject["port"] = "3000";
    configObject["host"] = "http://localhost:"+configObject.port;
    configObject["logLevel"] = "debug";
}

if(configObject.logLevel) {
    logger.transports.console.level = configObject.logLevel;
}

module.exports = configObject;