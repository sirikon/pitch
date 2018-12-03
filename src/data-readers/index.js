const fs = require('fs');
const path = require('path');

function getReaders() {
    return fs.readdirSync(__dirname)
        .map((fileName) => {
            const filePath = path.join(__dirname, fileName);
            if (filePath === __filename) return null;
            return require(filePath);
        })
        .filter(reader => reader !== null);
}

function defaultReader (filePath) {
    return fs.readFileSync(filePath, { encoding: 'utf8' });
}

const readers = getReaders();

module.exports = {
    read (filePath, parentData) {
        const fileExtension = path.extname(filePath);

        const matchingReaders = readers
            .filter((reader) => reader.fileExtension === fileExtension);

        if (matchingReaders.length > 0) {
            return matchingReaders[0].read(filePath, parentData);
        }

        return defaultReader(filePath);
    }
};
