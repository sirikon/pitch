const fs = require('fs');
const { Readable } = require('stream');
const ejs = require('ejs');

module.exports = {
    ejsProcessor: {
        name: 'ejs',
        test(file) {
            return file.substr(-4) == '.ejs'
        },
        outputExtension: 'html',
        process({ absolutePath, readStream, data }) {
            var template = fs.readFileSync(absolutePath, {encoding: 'utf8'});
            var stream = new Readable();
            stream.push(ejs.render(template, { data }));
            stream.push(null);
            return stream;
        }
    }
}
