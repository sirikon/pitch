const path = require('path');

function filenameWithoutExtension(fileName) {
    var extension = path.extname(fileName);
    return fileName.substr(0, fileName.length - extension.length);
}

module.exports = { filenameWithoutExtension }
