var PiDAO = require('./PiDAO');

var assetsVersion = 0;

module.exports = {
    updateAssetsVersion: function() {
        return PiDAO.getAssetsVersion()
            .then(function(result) {
                if (result[0]) {
                    assetsVersion = result[0].assetsVersion;
                }
				assetsVersion++;
				return PiDAO.setAssetsVersion(assetsVersion);
            });
    },

    getAssetsVersion: function() {
        return assetsVersion;
    }
};
