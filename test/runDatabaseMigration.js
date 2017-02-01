require('../common/logger');
var Auditionee = require('../persistence/models/auditionee');
var AdminUser = require('../persistence/models/adminUser');
var ConnectionManager = require('../persistence/ConnectionManager');
var moment = require('moment');
var PiDAO = require('../persistence/PiDAO');
var Promise = require('bluebird');
var _ = require('lodash');

console.info('Running mysql migration...');

ConnectionManager.openTest()
    .then(function() {
        return Auditionee.find({})
            .sort({submitDate: 'asc'})
            .exec();
    })
    .then(function(auditionees) {
        var tasks = [];

        for (var i = 0; i < auditionees.length; i++) {
            var dob = moment(auditionees[i].dob, 'MM/DD/YYYY').format('YYYY-MM-DD');
            var submitDate = moment(auditionees[i].submitDate).format("YYYY-MM-DD HH:mm:ss");

            var student = {};
            if (auditionees[i].firstName) student['firstName'] = auditionees[i].firstName;
            if (auditionees[i].lastName) student['lastName'] = auditionees[i].lastName;
            if (auditionees[i].email) student['email'] = auditionees[i].email;
            if (dob) student['birthDate'] = dob;
            if (auditionees[i].phone) student['phone'] = auditionees[i].phone;
            if (auditionees[i].pg1FirstName) student['guardianFirstName'] = auditionees[i].pg1FirstName;
            if (auditionees[i].pg1LastName) student['guardianLastName'] = auditionees[i].pg1LastName;
            if (auditionees[i].pg1Email) student['guardianEmail'] = auditionees[i].pg1Email;
            if (auditionees[i].pg1Phone1) student['guardianPhone'] = auditionees[i].pg1Phone1;
            if (auditionees[i].pg1Phone2) student['guardianPhone2'] = auditionees[i].pg1Phone2;
            if (auditionees[i].pg2FirstName) student['guardian2FirstName'] = auditionees[i].pg2FirstName;
            if (auditionees[i].pg2LastName) student['guardian2LastName'] = auditionees[i].pg2LastName;
            if (auditionees[i].pg2Email) student['guardian2Email'] = auditionees[i].pg2Email;
            if (auditionees[i].pg2Phone1) student['guardian2Phone'] = auditionees[i].pg2Phone1;
            if (auditionees[i].pg2Phone2) student['guardian2Phone2'] = auditionees[i].pg2Phone2;
            if (submitDate) student['createDate'] = submitDate;


            var address = {};
            if (auditionees[i].address1) address['address1'] = auditionees[i].address1;
            if (auditionees[i].address2) address['address2'] = auditionees[i].address2;
            if (auditionees[i].city) address['city'] = auditionees[i].city;
            if (auditionees[i].state) address['state'] = auditionees[i].state;
            if (auditionees[i].zip) address['zip'] = auditionees[i].zip;
            if (submitDate) address['createDate'] = submitDate;

            var gAddress = {};
            if (auditionees[i].pg1Address1) gAddress['address1'] = auditionees[i].pg1Address1;
            if (auditionees[i].pg1Address2) gAddress['address2'] = auditionees[i].pg1Address2;
            if (auditionees[i].pg1City) gAddress['city'] = auditionees[i].pg1City;
            if (auditionees[i].pg1State) gAddress['state'] = auditionees[i].pg1State;
            if (auditionees[i].pg1Zip) gAddress['zip'] = auditionees[i].pg1Zip;
            if (submitDate) gAddress['createDate'] = submitDate;


            var g2Address = {};
            if (auditionees[i].pg2Address1) g2Address['address1'] = auditionees[i].pg2Address1;
            if (auditionees[i].pg2Address2) g2Address['address2'] = auditionees[i].pg2Address2;
            if (auditionees[i].pg2City) g2Address['city'] = auditionees[i].pg2City;
            if (auditionees[i].pg2State) g2Address['state'] = auditionees[i].pg2State;
            if (auditionees[i].pg2Zip) g2Address['zip'] = auditionees[i].pg2Zip;
            if (submitDate) g2Address['createDate'] = submitDate;

            var auditionInfo = {};
            if (auditionees[i].school) auditionInfo['school'] = auditionees[i].school;
            if (auditionees[i].schoolYear) auditionInfo['schoolYear'] = auditionees[i].schoolYear;
            if (auditionees[i].auditionInstrument1) auditionInfo['instrument1'] = auditionees[i].auditionInstrument1;
            if (auditionees[i].auditionInstrument2) auditionInfo['instrument2'] = auditionees[i].auditionInstrument2;
            if (auditionees[i].auditionInstrument3) auditionInfo['instrument3'] = auditionees[i].auditionInstrument3;
            if (auditionees[i].referral) auditionInfo['referral'] = auditionees[i].referral;
            if (auditionees[i].referralOther) auditionInfo['referralOther'] = auditionees[i].referralOther;
            if (auditionees[i].yearsDrumming) auditionInfo['yearsDrumming'] = auditionees[i].yearsDrumming;
            if (auditionees[i].experience) auditionInfo['experience'] = auditionees[i].experience;
            if (auditionees[i].conflicts) auditionInfo['conflicts'] = auditionees[i].conflicts;
            if (auditionees[i].specialTalents) auditionInfo['specialTalents'] = auditionees[i].specialTalents;
            if (auditionees[i].goal) auditionInfo['goal'] = auditionees[i].goal;
            if (auditionees[i].season) auditionInfo['season'] = auditionees[i].season;
            if (submitDate) auditionInfo['createDate'] = submitDate;

            var insertPromise = (function(_student, _address, _gAddress, _g2Address, _auditionInfo) {
                return PiDAO.insertAddress(address)
                    .then(function(result) {
                        _student['addressId'] = result.insertId;
                        if (_gAddress.address1) {
                            return PiDAO.insertAddress(_gAddress);
                        }
                    })
                    .then(function(result) {
                        var guardianAddressId;
                        if (result) {
                            guardianAddressId = result.insertId;
                        } else {
                            guardianAddressId = _student['addressId'];
                        }
                        _student['guardianAddressId'] = guardianAddressId;

                        if (_g2Address.address1) {
                            return PiDAO.insertAddress(_g2Address);
                        }
                    })
                    .then(function(result) {
                        var guardian2AddressId;
                        if (result) {
                            guardian2AddressId = result.insertId;
                        } else {
                            guardian2AddressId = _student.guardianAddressId;
                        }
                        _student['guardian2AddressId'] = guardian2AddressId;

                        return PiDAO.insertStudent(_student);
                    })
                    .then(function(result) {
                        _auditionInfo['studentId'] = result.insertId;
                        return PiDAO.insertAuditionInfo(_auditionInfo);
                    });
            }(student, address, gAddress, g2Address, auditionInfo));

            tasks.push(insertPromise);
        }
        return Promise.all(tasks)
    })
    .then(function() {
        return AdminUser.find({})
            .sort({dateCreated: 'asc'})
            .exec();
    })
    .then(function(users) {
        var tasks = [];

        for (var i = 0; i < users.length; i++) {
            var createDate = moment(users[i].dateCreated).format("YYYY-MM-DD HH:mm:ss");
            var updateDate = moment(users[i].dateUpdated).format("YYYY-MM-DD HH:mm:ss");

            var staff = {};
            if (users[i].firstName) staff['firstName'] = users[i].firstName;
            if (users[i].lastName) staff['lastName'] = users[i].lastName;
            if (users[i].email) staff['email'] = users[i].email;
            if (users[i].password) staff['password'] = users[i].password;
            if (users[i].apiToken) staff['apiToken'] = users[i].apiToken;
            if (createDate) staff['createDate'] = createDate;
            if (updateDate) staff['updateDate'] = updateDate;

            var insertPromise = (function(_staff) {
                return PiDAO.insertStaff(_staff);
            })(staff);

            tasks.push(insertPromise);
        }

        return Promise.all(tasks);
    })
    .then(function() {
        return compareAuditionees(); // next compare is called in the else of the next then()
    })
    .then(function(result) {
        if (!result.success) {
            console.log('Auditionees compare failed. ' + result.message);
            if (result.rows) {
                console.log(result.rows);
            }
        } else {
            return compareStaff(); // next compare is called in the else of the next then()
        }
    })
    .then(function(result) {
        if (result) {
            if (!result.success) {
                console.log('Staff compare failed. ' + result.message);
                if (result.rows) {
                    console.log(result.rows);
                }
            } else {
                console.log('Database compare success');
            }
        } // if there's no result object, it means the previous .then() sent a response.
    })
    .catch(function(e) {
        console.error('error migrating data to mysql: \n' + e.stack);
    })
    .then(function() {
        return ConnectionManager.close();
    })
    .then(function() {
        console.log('\n\nDone!');
        process.exit();
    })
    .catch(function(e) {
        console.error(e.stack);
    });



var compareAuditionees = function() {
    return Promise.all([
            PiDAO.getAuditionees(),
            Auditionee.find({})
                .sort({submitDate: 'asc'})
                .exec()
        ])
        .then(function(results) {
            var mysqlRows = results[0];
            var mongoRows = results[1];

            if (mysqlRows.length !== mongoRows.length) {
                return {
                    success: false,
                    message: 'Number of auditionee rows does not match between mongo and mysql'
                };
            } else {
                var mismatchedRows = [];
                for (var i = 0; i < mongoRows.length; i++) {
                    var mongoSubmitDate = moment(mongoRows[i].submitDate).format("YYYY-MM-DDTHH:mm:ssZZ");
                    var mongoBirthDate = moment(mongoRows[i].dob, 'MM/DD/YYYY').format('YYYY-MM-DD');

                    var mysqlStudentCreateDate = moment(mysqlRows[i].studentCreateDate).format("YYYY-MM-DDTHH:mm:ssZZ");
                    var mysqlAddressCreateDate = moment(mysqlRows[i].addressCreateDate).format("YYYY-MM-DDTHH:mm:ssZZ");
                    var mysqlGAddressCreateDate = moment(mysqlRows[i].gaCreateDate).format("YYYY-MM-DDTHH:mm:ssZZ");
                    var mysqlG2AddressCreateDate = moment(mysqlRows[i].ga2CreateDate).format("YYYY-MM-DDTHH:mm:ssZZ");
                    var mysqlAuditionInfoCreateDate = moment(mysqlRows[i].auditionInfoCreateDate).format("YYYY-MM-DDTHH:mm:ssZZ");

                    var mongoPg1Address1;
                    var mongoPg1Address2;
                    var mongoPg1City;
                    var mongoPg1State;
                    var mongoPg1Zip;
                    if (mongoRows[i].pg1Address1 &&
                        mongoRows[i].pg1City &&
                        mongoRows[i].pg1State &&
                        mongoRows[i].pg1Zip) {
                        mongoPg1Address1 = mongoRows[i].pg1Address1;
                        mongoPg1Address2 = mongoRows[i].pg1Address2;
                        mongoPg1City = mongoRows[i].pg1City;
                        mongoPg1State = mongoRows[i].pg1State;
                        mongoPg1Zip = mongoRows[i].pg1Zip.toString();
                    } else {
                        mongoPg1Address1 = mongoRows[i].address1;
                        mongoPg1Address2 = mongoRows[i].address2;
                        mongoPg1City = mongoRows[i].city;
                        mongoPg1State = mongoRows[i].state;
                        mongoPg1Zip = mongoRows[i].zip.toString();
                    }

                    var mongoPg2Address1;
                    var mongoPg2Address2;
                    var mongoPg2City;
                    var mongoPg2State;
                    var mongoPg2Zip;
                    if (mongoRows[i].pg2Address1 &&
                        mongoRows[i].pg2City &&
                        mongoRows[i].pg2State &&
                        mongoRows[i].pg2Zip) {
                        mongoPg2Address1 = mongoRows[i].pg2Address1;
                        mongoPg2Address2 = mongoRows[i].pg2Address2;
                        mongoPg2City = mongoRows[i].pg2City;
                        mongoPg2State = mongoRows[i].pg2State;
                        mongoPg2Zip = mongoRows[i].pg2Zip.toString();
                    } else {
                        mongoPg2Address1 = mongoPg1Address1;
                        mongoPg2Address2 = mongoPg1Address2;
                        mongoPg2City = mongoPg1City;
                        mongoPg2State = mongoPg1State;
                        mongoPg2Zip = mongoPg1Zip;
                    }

                    if (!compare(mongoRows[i].firstName, mysqlRows[i].firstName)) {
                        mismatchedRows.push('Mismatch on firstName: ' + mongoRows[i].firstName + ' -> ' + mysqlRows[i].firstName);
                    } else if (!compare(mongoRows[i].lastName, mysqlRows[i].lastName)) {
                        mismatchedRows.push('Mismatch on lastName: ' + mongoRows[i].lastName + ' -> ' + mysqlRows[i].lastName);
                    } else if (!compare(mongoRows[i].email, mysqlRows[i].email)) {
                        mismatchedRows.push('Mismatch on email: ' + mongoRows[i].email + ' -> ' + mysqlRows[i].email);
                    } else if (!compare(mongoBirthDate, mysqlRows[i].birthDate)) {
                        mismatchedRows.push('Mismatch on birthDate: ' + mongoBirthDate + ' -> ' + mysqlRows[i].birthDate);
                    } else if (!compare(mongoRows[i].phone, mysqlRows[i].phone)) {
                        mismatchedRows.push('Mismatch on phone: ' + mongoRows[i].phone + ' -> ' + mysqlRows[i].phone);
                    } else if (!compare(mongoSubmitDate, mysqlStudentCreateDate)) {
                        mismatchedRows.push('Mismatch on studentCreateDate: ' + mongoSubmitDate + ' -> ' + mysqlStudentCreateDate);
                    }

                    else if (!compare(mongoRows[i].address1, mysqlRows[i].address1)) {
                        mismatchedRows.push('Mismatch on address1: ' + mongoRows[i].address1 + ' -> ' + mysqlRows[i].address1);
                    } else if (!compare(mongoRows[i].address2, mysqlRows[i].address2)) {
                        mismatchedRows.push('Mismatch on address2: ' + mongoRows[i].address2 + ' -> ' + mysqlRows[i].address2);
                    } else if (!compare(mongoRows[i].city, mysqlRows[i].city)) {
                        mismatchedRows.push('Mismatch on city: ' + mongoRows[i].city + ' -> ' + mysqlRows[i].city);
                    } else if (!compare(mongoRows[i].state, mysqlRows[i].state)) {
                        mismatchedRows.push('Mismatch on state: ' + mongoRows[i].state + ' -> ' + mysqlRows[i].state);
                    } else if (!compare(mongoRows[i].zip.toString(), mysqlRows[i].zip)) {
                        mismatchedRows.push('Mismatch on zip: ' + mongoRows[i].zip + ' -> ' + mysqlRows[i].zip);
                    } else if (!compare(mongoSubmitDate, mysqlAddressCreateDate)) {
                        mismatchedRows.push('Mismatch on addressCreateDate: ' + mongoSubmitDate + ' -> ' + mysqlAddressCreateDate);
                    }

                    else if (!compare(mongoRows[i].pg1FirstName, mysqlRows[i].guardianFirstName)) {
                        mismatchedRows.push('Mismatch on pg1FirstName: ' + mongoRows[i].pg1FirstName + ' -> ' + mysqlRows[i].guardianFirstName);
                    } else if (!compare(mongoRows[i].pg1LastName, mysqlRows[i].guardianLastName)) {
                        mismatchedRows.push('Mismatch on pg1LastName: ' + mongoRows[i].pg1LastName + ' -> ' + mysqlRows[i].guardianLastName);
                    } else if (!compare(mongoRows[i].pg1Email, mysqlRows[i].guardianEmail)) {
                        mismatchedRows.push('Mismatch on pg1Email: ' + mongoRows[i].pg1Email + ' -> ' + mysqlRows[i].guardianEmail);
                    } else if (!compare(mongoRows[i].pg1Phone1, mysqlRows[i].guardianPhone)) {
                        mismatchedRows.push('Mismatch on pg1Phone1: ' + mongoRows[i].pg1Phone1 + ' -> ' + mysqlRows[i].guardianPhone);
                    } else if (!compare(mongoRows[i].pg1Phone2, mysqlRows[i].guardianPhone2)) {
                        mismatchedRows.push('Mismatch on pg1Phone2: ' + mongoRows[i].pg1Phone2 + ' -> ' + mysqlRows[i].guardianPhone2);
                    }

                    else if (!compare(mongoPg1Address1, mysqlRows[i].gaAddress1)) {
                        mismatchedRows.push('Mismatch on pg1Address1: ' + mongoPg1Address1 + ' -> ' + mysqlRows[i].gaAddress1);
                    } else if (!compare(mongoPg1Address2, mysqlRows[i].gaAddress2)) {
                        mismatchedRows.push('Mismatch on pg1Address2: ' + mongoPg1Address2 + ' -> ' + mysqlRows[i].gaAddress2);
                    } else if (!compare(mongoPg1City, mysqlRows[i].gaCity)) {
                        mismatchedRows.push('Mismatch on pg1City: ' + mongoPg1City + ' -> ' + mysqlRows[i].gaCity);
                    } else if (!compare(mongoPg1State, mysqlRows[i].gaState)) {
                        mismatchedRows.push('Mismatch on pg1State: ' + mongoPg1State + ' -> ' + mysqlRows[i].gaState);
                    } else if (!compare(mongoPg1Zip, mysqlRows[i].gaZip)) {
                        mismatchedRows.push('Mismatch on pg1Zip: ' + mongoPg1Zip + ' -> ' + mysqlRows[i].gaZip);
                    } else if (!compare(mongoSubmitDate, mysqlGAddressCreateDate)) {
                        mismatchedRows.push('Mismatch on gAddressCreateDate: ' + mongoSubmitDate + ' -> ' + mysqlGAddressCreateDate);
                    }

                    else if (!compare(mongoRows[i].pg2FirstName, mysqlRows[i].guardian2FirstName)) {
                        mismatchedRows.push('Mismatch on pg2FirstName: ' + mongoRows[i].pg2FirstName + ' -> ' + mysqlRows[i].guardian2FirstName);
                    } else if (!compare(mongoRows[i].pg2LastName, mysqlRows[i].guardian2LastName)) {
                        mismatchedRows.push('Mismatch on pg2LastName: ' + mongoRows[i].pg2LastName + ' -> ' + mysqlRows[i].guardian2LastName);
                    } else if (!compare(mongoRows[i].pg2Email, mysqlRows[i].guardian2Email)) {
                        mismatchedRows.push('Mismatch on pg2Email: ' + mongoRows[i].pg2Email + ' -> ' + mysqlRows[i].guardian2Email);
                    } else if (!compare(mongoRows[i].pg2Phone1, mysqlRows[i].guardian2Phone)) {
                        mismatchedRows.push('Mismatch on pg2Phone1: ' + mongoRows[i].pg2Phone1 + ' -> ' + mysqlRows[i].guardian2Phone);
                    } else if (!compare(mongoRows[i].pg2Phone2, mysqlRows[i].guardian2Phone2)) {
                        mismatchedRows.push('Mismatch on pg2Phone2: ' + mongoRows[i].pg2Phone2 + ' -> ' + mysqlRows[i].guardian2Phone2);
                    }

                    else if (!compare(mongoPg2Address1, mysqlRows[i].ga2Address1)) {
                        mismatchedRows.push('Mismatch on pg2Address1: ' + mongoPg2Address1 + ' -> ' + mysqlRows[i].ga2Address1);
                    } else if (!compare(mongoPg2Address2, mysqlRows[i].ga2Address2)) {
                        mismatchedRows.push('Mismatch on pg2Address2: ' + mongoPg2Address2 + ' -> ' + mysqlRows[i].ga2Address2);
                    } else if (!compare(mongoPg2City, mysqlRows[i].ga2City)) {
                        mismatchedRows.push('Mismatch on pg2City: ' + mongoPg2City + ' -> ' + mysqlRows[i].ga2City);
                    } else if (!compare(mongoPg2State, mysqlRows[i].ga2State)) {
                        mismatchedRows.push('Mismatch on pg2State: ' + mongoPg2State + ' -> ' + mysqlRows[i].ga2State);
                    } else if (!compare(mongoPg2Zip, mysqlRows[i].ga2Zip)) {
                        mismatchedRows.push('Mismatch on pg2Zip: ' + mongoPg2Zip + ' -> ' + mysqlRows[i].ga2Zip);
                    } else if (!compare(mongoSubmitDate, mysqlG2AddressCreateDate)) {
                        mismatchedRows.push('Mismatch on g2AddressCreateDate: ' + mongoSubmitDate + ' -> ' + mysqlG2AddressCreateDate);
                    }

                    else if (!compare(mongoRows[i].school, mysqlRows[i].school)) {
                        mismatchedRows.push('Mismatch on school: ' + mongoRows[i].school + ' -> ' + mysqlRows[i].school);
                    } else if (!compare(mongoRows[i].schoolYear, mysqlRows[i].schoolYear)) {
                        mismatchedRows.push('Mismatch on schoolYear: ' + mongoRows[i].schoolYear + ' -> ' + mysqlRows[i].schoolYear);
                    } else if (!compare(mongoRows[i].auditionInstrument1, mysqlRows[i].instrument1)) {
                        mismatchedRows.push('Mismatch on instrument1: ' + mongoRows[i].auditionInstrument1 + ' -> ' + mysqlRows[i].instrument1);
                    } else if (!compare(mongoRows[i].auditionInstrument2, mysqlRows[i].instrument2)) {
                        mismatchedRows.push('Mismatch on instrument2: ' + mongoRows[i].auditionInstrument2 + ' -> ' + mysqlRows[i].instrument2);
                    } else if (!compare(mongoRows[i].auditionInstrument3, mysqlRows[i].instrument3)) {
                        mismatchedRows.push('Mismatch on instrument3: ' + mongoRows[i].auditionInstrument3 + ' -> ' + mysqlRows[i].instrument3);
                    } else if (!compare(mongoRows[i].referral, mysqlRows[i].referral)) {
                        mismatchedRows.push('Mismatch on referral: ' + mongoRows[i].referral + ' -> ' + mysqlRows[i].referral);
                    } else if (!compare(mongoRows[i].referralOther, mysqlRows[i].referralOther)) {
                        mismatchedRows.push('Mismatch on referralOther: ' + mongoRows[i].referralOther + ' -> ' + mysqlRows[i].referralOther);
                    } else if (!compare(mongoRows[i].yearsDrumming, mysqlRows[i].yearsDrumming)) {
                        mismatchedRows.push('Mismatch on yearsDrumming: ' + mongoRows[i].yearsDrumming + ' -> ' + mysqlRows[i].yearsDrumming);
                    } else if (!compare(mongoRows[i].experience, mysqlRows[i].experience)) {
                        mismatchedRows.push('Mismatch on experience: ' + mongoRows[i].experience + ' -> ' + mysqlRows[i].experience);
                    } else if (!compare(mongoRows[i].conflicts, mysqlRows[i].conflicts)) {
                        mismatchedRows.push('Mismatch on conflicts: ' + mongoRows[i].conflicts + ' -> ' + mysqlRows[i].conflicts);
                    } else if (!compare(mongoRows[i].specialTalents, mysqlRows[i].specialTalents)) {
                        mismatchedRows.push('Mismatch on specialTalents: ' + mongoRows[i].specialTalents + ' -> ' + mysqlRows[i].specialTalents);
                    } else if (!compare(mongoRows[i].goal, mysqlRows[i].goal)) {
                        mismatchedRows.push('Mismatch on goal: ' + mongoRows[i].goal + ' -> ' + mysqlRows[i].goal);
                    } else if (!compare(mongoRows[i].season, mysqlRows[i].season)) {
                        mismatchedRows.push('Mismatch on season: ' + mongoRows[i].season + ' -> ' + mysqlRows[i].season);
                    } else if (!compare(mongoSubmitDate, mysqlAuditionInfoCreateDate)) {
                        mismatchedRows.push('Mismatch on auditionInfoCreateDate: ' + mongoSubmitDate + ' -> ' + mysqlAuditionInfoCreateDate);
                    }
                }

                if (mismatchedRows.length > 0) {
                    return {
                        success: false,
                        message: 'mismatched rows',
                        rows: mismatchedRows
                    };
                } else {
                    return {
                        success: true
                    };
                }
            }
        });
};

var compareStaff = function() {
    return Promise.all([
        PiDAO.getStaff(),
        AdminUser.find({})
            .sort({dateCreated: 'asc'})
            .exec()
    ])
        .then(function(results) {
            var mysqlRows = results[0];
            var mongoRows = results[1];

            if (mysqlRows.length !== mongoRows.length) {
                return {
                    success: false,
                    message: 'Number of staff rows does not match between mongo and mysql'
                };
            } else {
                var mismatchedRows = [];
                for (var i = 0; i < mongoRows.length; i++) {
                    var createDate = moment(mongoRows[i].dateCreated).format("YYYY-MM-DDTHH:mm:ssZZ");
                    var updateDate = moment(mongoRows[i].dateUpdated).format("YYYY-MM-DDTHH:mm:ssZZ");

                    var mysqlCreateDate = moment(mysqlRows[i].createDate).format("YYYY-MM-DDTHH:mm:ssZZ");
                    var mysqlUpdateDate = moment(mysqlRows[i].updateDate).format("YYYY-MM-DDTHH:mm:ssZZ");

                    if (!compare(mongoRows[i].firstName, mysqlRows[i].firstName)) {
                        mismatchedRows.push('Mismatch on firstName: ' + mongoRows[i].firstName + ' -> ' + mysqlRows[i].firstName);
                    } else if (!compare(mongoRows[i].lastName, mysqlRows[i].lastName)) {
                        mismatchedRows.push('Mismatch on lastName: ' + mongoRows[i].lastName + ' -> ' + mysqlRows[i].lastName);
                    } else if (!compare(mongoRows[i].email, mysqlRows[i].email)) {
                        mismatchedRows.push('Mismatch on email: ' + mongoRows[i].email + ' -> ' + mysqlRows[i].email);
                    } else if (!compare(mongoRows[i].password, mysqlRows[i].password)) {
                        mismatchedRows.push('Mismatch on password: ' + mongoRows[i].password + ' -> ' + mysqlRows[i].password);
                    } else if (!compare(mongoRows[i].apiToken, mysqlRows[i].apiToken)) {
                        mismatchedRows.push('Mismatch on apiToken: ' + mongoRows[i].apiToken + ' -> ' + mysqlRows[i].apiToken);
                    } else if (!compare(createDate, mysqlCreateDate)) {
                        mismatchedRows.push('Mismatch on createDate: ' + createDate + ' -> ' + mysqlCreateDate);
                    } else if (!compare(updateDate, mysqlUpdateDate)) {
                        mismatchedRows.push('Mismatch on updateDate: ' + updateDate + ' -> ' + mysqlUpdateDate);
                    }
                }

                if (mismatchedRows.length > 0) {
                    return {
                        success: false,
                        message: 'mismatched rows',
                        rows: mismatchedRows
                    };
                } else {
                    return {
                        success: true
                    };
                }
            }
        });
};

var compare = function(val1, val2) {
    if (!val1 && !val2) {
        return true;
    } else {
        return _.isEqual(val1, val2);
    }
};