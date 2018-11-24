const fs = require('fs');
const showdown = require('showdown');

module.exports = {
    fileExtension: '.md',
    read(filePath) {
        const showdownConverter = new showdown.Converter({ metadata: true });
        const content = fs.readFileSync(filePath, { encoding: 'utf8' });
        return {
            text: content,
            html: showdownConverter.makeHtml(content),
            meta: showdownConverter.getMetadata()
        };
    }
};
