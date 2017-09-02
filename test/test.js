var _ = require('lodash');

var object = {
    prop1: {
        prop2: {}
    }
};

if (object.prop1.prop2) {
    console.log('prop2 exists');
}

if (object.prop1.prop2.prop3) {
    console.log('prop3 exists');
} else {
    console.log('prop3 does not exist');
}

if (!_.isUndefined(object.prop1.prop2.prop3.prop4)) {
    console.log('prop4 exists');
} else {
    console.log('prop4 does not exist');
}