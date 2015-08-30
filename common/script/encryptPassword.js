var utils = require('../utils');

console.log('password: ' + process.argv[2]);
console.log('encrypted password: ' + utils.createHash(process.argv[2]));