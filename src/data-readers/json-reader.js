const fs = require('fs');

module.exports = {
    fileExtension: '.json',
    read(filePath) {
        const content = fs.readFileSync(filePath, { encoding: 'utf8' });
        return JSON.parse(content);
    }
};
