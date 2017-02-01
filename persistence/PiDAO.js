var Promise = require("bluebird");
var ConnectionManager = require('./ConnectionManager');

module.exports = {

    getStudents: function() {
        return Promise.using(ConnectionManager.getConnection(), function(connection) {
            return connection.query('select * from student');
        });
    },

    getAuditionees: function() {
        return Promise.using(ConnectionManager.getConnection(), function(connection) {
            return connection.query(
                'select ' +
                    's.firstName,' +
                    's.lastName,' +
                    's.email,' +
                    's.birthDate,' +
                    's.phone,' +
                    's.guardianFirstName,' +
                    's.guardianLastName,' +
                    's.guardianEmail,' +
                    's.guardianPhone,' +
                    's.guardianPhone2,' +
                    's.guardian2FirstName,' +
                    's.guardian2LastName,' +
                    's.guardian2Email,' +
                    's.guardian2Phone,' +
                    's.guardian2Phone2,' +
                    's.createDate as studentCreateDate,' +
                    'a.address1,' +
                    'a.address2,' +
                    'a.city,' +
                    'a.state,' +
                    'a.zip,' +
                    'a.createDate as addressCreateDate,' +
                    'ga.address1 as gaAddress1,' +
                    'ga.address2 as gaAddress2,' +
                    'ga.city as gaCity,' +
                    'ga.state as gaState,' +
                    'ga.zip as gaZip,' +
                    'ga.createDate as gaCreateDate,' +
                    'ga2.address1 as ga2Address1,' +
                    'ga2.address2 as ga2Address2,' +
                    'ga2.city as ga2City,' +
                    'ga2.state as ga2State,' +
                    'ga2.zip as ga2Zip,' +
                    'ga2.createDate as ga2CreateDate,' +
                    'ai.school,' +
                    'ai.schoolYear,' +
                    'ai.instrument1,' +
                    'ai.instrument2,' +
                    'ai.instrument3,' +
                    'ai.referral,' +
                    'ai.referralOther,' +
                    'ai.yearsDrumming,' +
                    'ai.experience,' +
                    'ai.conflicts,' +
                    'ai.specialTalents,' +
                    'ai.goal,' +
                    'ai.season,' +
                    'ai.createDate as auditionInfoCreateDate ' +
                'from student s ' +
                'left join address a on a.id = s.addressId ' +
                'left join address ga on ga.id = s.guardianAddressId ' +
                'left join address ga2 on ga2.id = s.guardian2AddressId ' +
                'left join auditioninfo ai on ai.studentId = s.id ' +
                'order by ai.createDate asc'
            );
        });
    },

    getStaff: function() {
        return Promise.using(ConnectionManager.getConnection(), function(connection) {
            return connection.query('select * from staff order by createDate asc');
        });
    },

    insertStaff: function(staff) {
        return Promise.using(ConnectionManager.getConnection(), function(connection) {
            return connection.query('insert into staff set ?', staff);
        });
    },

    insertStudent: function(student) {
        return Promise.using(ConnectionManager.getConnection(), function(connection) {
            return connection.query('insert into student set ?', student);
        });
    },

    insertAddress: function(address) {
        return Promise.using(ConnectionManager.getConnection(), function(connection) {
            return connection.query('insert into address set ?', address);
        });
    },

    insertAuditionInfo: function(auditionInfo) {
        return Promise.using(ConnectionManager.getConnection(), function(connection) {
            return connection.query('insert into auditioninfo set ?', auditionInfo);
        });
    },

    getAuditionSeasons: function() {
        return Promise.using(ConnectionManager.getConnection(), function(connection) {
            return connection.query('select distinct season from auditioninfo');
        });
    },

    getFacebookPosts: function() {
        return Promise.using(ConnectionManager.getConnection(), function(connection) {
            return connection.query('select * from facebookpost order by createdTime asc');
        });
    },

    deleteFacebookPost: function(postId) {
        return Promise.using(ConnectionManager.getConnection(), function(connection) {
            return connection.query('delete from facebookpost where id = ?', postId);
        });
    },

    insertFacebookPost: function(facebookPost) {
        return Promise.using(ConnectionManager.getConnection(), function(connection) {
            return connection.query('insert into facebookpost set ?', facebookPost);
        });
    },

    updateFacebookPost: function(facebookPost, id) {
        return Promise.using(ConnectionManager.getConnection(), function(connection) {
            return connection.query('update facebookpost set ? where id = ?', [facebookPost, id]);
        });
    }

};