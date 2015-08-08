var util = require('util');
var moment = require('moment/min/moment.min.js');
var winston = require('winston');

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            timestamp: function() { return moment().format("MMM DD, YYYY h:mm:ss A") },
            level: 'info'
        })
    ]
});

function formatArgs(args){
    return [util.format.apply(util.format, Array.prototype.slice.call(args))];
}

console.log = function(){
    //there's no (Winston) logger.log, so direct this to logger.info as well.
    logger.info.apply(logger, formatArgs(arguments));
};
console.info = function(){
    logger.info.apply(logger, formatArgs(arguments));
};
console.warn = function(){
    logger.warn.apply(logger, formatArgs(arguments));
};
console.error = function(){
    logger.error.apply(logger, formatArgs(arguments));
};
console.debug = function(){
    logger.debug.apply(logger, formatArgs(arguments));
};

module.exports = logger;