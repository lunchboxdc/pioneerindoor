var utils = require('../utils');
var authToken = require('crypto').randomBytes(32).toString('hex');
var encAuthToken = utils.createHash(authToken);

console.log('Auth Token: %s', authToken);
console.log('Encrypted Auth Token: %s', encAuthToken);