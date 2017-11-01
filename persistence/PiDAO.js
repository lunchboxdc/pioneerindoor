var Promise = require("bluebird");
var ConnectionManager = require('./ConnectionManager');

module.exports = {

    getAssetsVersion: function() {
        return Promise.using(ConnectionManager.getConnection(), function(connection) {
            return connection.query('select assetsVersion from assets where id = 1');
        });
    },

    setAssetsVersion: function(assetsVersion) {
        return Promise.using(ConnectionManager.getConnection(), function(connection) {
            return connection.query('update assets set assetsVersion = ? where id = 1', assetsVersion);
        });
    },

    getStudents: function() {
        return Promise.using(ConnectionManager.getConnection(), function(connection) {
            return connection.query('select * from student');
        });
    },

    getAuditioneesForSeason: function(season) {
        return Promise.using(ConnectionManager.getConnection(), function(connection) {
            return connection.query(
                'select ' +
                    's.id as studentId,' +
                    's.firstName,' +
                    's.lastName,' +
                    's.email,' +
                    's.birthDate,' +
                    's.phone,' +
                    's.addressId,' +
                    's.guardianFirstName,' +
                    's.guardianLastName,' +
                    's.guardianEmail,' +
                    's.guardianPhone,' +
                    's.guardianPhone2,' +
                    's.guardianAddressId,' +
                    's.guardian2FirstName,' +
                    's.guardian2LastName,' +
                    's.guardian2Email,' +
                    's.guardian2Phone,' +
                    's.guardian2Phone2,' +
                    's.guardian2AddressId,' +
                    's.createDate as studentCreateDate,' +
                    'a.address1,' +
                    'a.address2,' +
                    'a.city,' +
                    'a.state,' +
                    'a.zip,' +
                    'a.createDate as addressCreateDate,' +
                    'ga.address1 as guardianAddress1,' +
                    'ga.address2 as guardianAddress2,' +
                    'ga.city as guardianCity,' +
                    'ga.state as guardianState,' +
                    'ga.zip as guardianZip,' +
                    'ga.createDate as guardianCreateDate,' +
                    'ga2.address1 as guardian2Address1,' +
                    'ga2.address2 as guardian2Address2,' +
                    'ga2.city as guardian2City,' +
                    'ga2.state as guardian2State,' +
                    'ga2.zip as guardian2Zip,' +
                    'ga2.createDate as guardian2CreateDate,' +
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
                'join address a on a.id = s.addressId ' +
                'join address ga on ga.id = s.guardianAddressId ' +
                'left join address ga2 on ga2.id = s.guardian2AddressId ' +
                'join auditioninfo ai on ai.studentId = s.id ' +
                'where ai.season = ? ' +
                'and s.deleted <> 1 ' +
                'order by ai.createDate asc',
                season
            );
        });
    },

    getAuditioneesForEmail: function(season) {
        return Promise.using(ConnectionManager.getConnection(), function(connection) {
            return connection.query(
                'select ' +
                's.firstName,' +
                's.email ' +
                'from student s ' +
                'join address a on a.id = s.addressId ' +
                'join address ga on ga.id = s.guardianAddressId ' +
                'left join address ga2 on ga2.id = s.guardian2AddressId ' +
                'join auditioninfo ai on ai.studentId = s.id ' +
                'where ai.season = ? ' +
                'and s.deleted <> 1',
                season
            );
        });
    },

    getStudentById: function(studentId) {
        return Promise.using(ConnectionManager.getConnection(), function(connection) {
            return connection.query('select * from student where id = ?', studentId);
        });
    },

    updateStudent: function(student) {
        return Promise.using(ConnectionManager.getConnection(), function(connection) {
            return connection.query('update student set ? where id = ?', [student, student.id]);
        });
    },

    getAllStaffUsers: function() {
        return Promise.using(ConnectionManager.getConnection(), function(connection) {
            return connection.query('select * from staff order by createDate asc');
        });
    },

    getStaffUserById: function(id) {
        return Promise.using(ConnectionManager.getConnection(), function(connection) {
            return connection.query('select * from staff where id = ?', id);
        });
    },

    getStaffUserByEmail: function(email) {
        return Promise.using(ConnectionManager.getConnection(), function(connection) {
            return connection.query('select * from staff where email = ?', email);
        });
    },

    insertStaffUser: function(staffUser) {
        return Promise.using(ConnectionManager.getConnection(), function(connection) {
            return connection.query('insert into staff set ?', staffUser);
        });
    },

    updateStaffUser: function(staffUser) {
        return Promise.using(ConnectionManager.getConnection(), function(connection) {
            return connection.query('update staff set ? where id = ?', [staffUser, staffUser.id]);
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
            return connection.query('select * from facebookpost order by createdTime desc');
        });
    },

    deleteFacebookPost: function(postId) {
        return Promise.using(ConnectionManager.getConnection(), function(connection) {
            return connection.query('delete from facebookpost where id = ?', postId);
        });
    },

    deleteAllFacebookPosts: function() {
        return Promise.using(ConnectionManager.getConnection(), function(connection) {
            return connection.query('delete from facebookpost');
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