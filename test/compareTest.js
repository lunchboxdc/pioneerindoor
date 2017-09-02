var _ = require('lodash');

var undef;

var values = [
    {
        val1: undef,
        val2: undef,
        expected: 'true '
    },{
        val1: null,
        val2: undef,
        expected: 'true '
    },{
        val1: "",
        val2: undef,
        expected: 'true '
    },{
        val1: null,
        val2: "",
        expected: 'true '
    },{
        val1: null,
        val2: null,
        expected: 'true '
    },{
        val1: "",
        val2: "",
        expected: 'true '
    },{
        val1: undef,
        val2: "sdf",
        expected: false
    },{
        val1: null,
        val2: "sdf",
        expected: false
    },{
        val1: "sdf",
        val2: "sdssf",
        expected: false
    },{
        val1: "sdssf",
        val2: "sdssf",
        expected: 'true '
    },{
        val1: "  ",
        val2: "sdssf",
        expected: false
    },{
        val1: "  sdssf  ",
        val2: "sdssf",
        expected: false
    }
];


for (var i = 0; i < values.length; i++) {
    var retVal;
    if (!values[i].val1 && !values[i].val2) {
        retVal = 'true ';
    } else {
        retVal = _.isEqual(values[i].val1, values[i].val2) ? 'true ' : false;
    }

    console.log('expected --> ' + values[i].expected + '    actual --> ' + retVal + '          val1: ' + values[i].val1 + ' val2: ' + values[i].val2);
}