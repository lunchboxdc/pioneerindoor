var PiDAO = require('./PiDAO');

var assetsVersion;

module.exports = {
    updateAssetsVersion: function() {
        return PiDAO.getAssetsVersion()
            .then(function(result) {
                if (result[0]) {
                    assetsVersion = result[0].assetsVersion;
                    assetsVersion++;
                    return PiDAO.setAssetsVersion(assetsVersion);
                } else {
                    throw new Error('assetsVersion not found in assets table.');
                }
            });
    },

    getAssetsVersion: function() {
        return assetsVersion;
    }
};