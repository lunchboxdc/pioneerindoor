var appConfig = require('./appConfig');
var AssetsVersion = require('../persistence/AssetsVersion');
var moment = require('moment');

module.exports = {
    equals: function(a, b, options) {
        if (a === b) {
            return options.fn(this);
        }
        return options.inverse(this);
    },
    notEmpty: function(val, options) {
        if (typeof val !== 'undefined' && val !== null && val.length > 0) {
            return options.fn(this);
        }
        return options.inverse(this);
    },
    formatIsoDate: function(date, format) {
        if (format && date && format.length > 0) {
            if (!(date instanceof moment)) {
                date = moment(date, moment.ISO_8601);
            }
            return date.format(format);
        }
    },
    getYear: function(date, offset) {
        if (date) {
            if (!(date instanceof moment)) {
                date = moment(date, moment.ISO_8601);
            }
            if (!offset) {
                offset = 0;
            }
            return date.year() + offset;
        }
    },
    selectOption: function(selectedValue, option, value) {
        if (typeof value !== 'string') {
            value = option;
        }
        var html = '<option value="' + value +'"';

        if (Array.isArray(selectedValue)) {
            selectedValue = selectedValue[0];
        }
        if (selectedValue === value) {
            html += ' selected="selected"';
        }
        html += '>'+ option + '</option>';
        return html;
    },
    preselectCheckbox: function(val) {
        if (val === "true") {
            return 'checked';
        }
    },
    preselectCheckboxFalse: function(val) {
        if (val !== "false") {
            return 'checked';
        }
    },
    getAge: function(val) {
        if (val && val.length > 0) {
            return moment().diff(moment(val, 'YYYY-MM-DD'), 'years');
        }
    },
    section: function(name, options) {
        if (!this._sections) {
            this._sections = {};
        }
        this._sections[name] = options.fn(this);
    },
    assetsVersion: function() {
        return AssetsVersion.getAssetsVersion();
    },
    isProduction: function(options) {
        if (appConfig.nodeEnv === 'prod') {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    }
};