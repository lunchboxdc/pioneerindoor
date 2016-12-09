var Promise = require("bluebird");
var ConnectionManager = require('./ConnectionManager');

module.exports = {

    getStudents: function() {
        return Promise.using(ConnectionManager.getConnection(), function(connection) {
            return connection.query('select * from student');
        })
    },

    getAuditionSeasons: function() {
        return Promise.using(ConnectionManager.getConnection(), function(connection) {
            return connection.query('select distinct season from auditioninfo');
        })
    }

};