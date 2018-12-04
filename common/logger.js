const appConfig = require('./appConfig');
const util = require('util');
const moment = require('moment/min/moment.min.js');
const winston = require('winston');

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(i => `${i.timestamp} - ${i.message}`)
  ),
  transports: [
    new winston.transports.Console({
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true
    })
  ]
})

function formatArgs(args) {
    return [util.format.apply(util.format, Array.prototype.slice.call(args))];
}

console.log = function() {
    //there's no (Winston) logger.log, so direct this to logger.info as well.
    logger.info.apply(logger, formatArgs(arguments));
};
console.info = function() {
    logger.info.apply(logger, formatArgs(arguments));
};
console.warn = function() {
    logger.warn.apply(logger, formatArgs(arguments));
};
console.error = function() {
    logger.error.apply(logger, formatArgs(arguments));
};
console.debug = function() {
    logger.debug.apply(logger, formatArgs(arguments));
};

module.exports = logger;
