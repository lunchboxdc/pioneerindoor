var FacebookService = require('../FacebookService');
var ConnectionManager = require('../../persistence/ConnectionManager');

ConnectionManager.open();

FacebookService.getPosts();
FacebookService.getProfilePicture();

ConnectionManager.close();