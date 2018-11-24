const path = require('path');
const { requireUncached } = require('../utils');

module.exports = {
    fileExtension: '.js',
    read(filePath) {
        return requireUncached(path.resolve(filePath)).data;
    }
};
