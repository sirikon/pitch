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
            var stream = new Readable();

            ejs.renderFile(absolutePath, { data }, (err, result) => {
                if (err) throw err;
                stream.push(result);
                stream.push(null);
            });

            return stream;
        }
    }
}
