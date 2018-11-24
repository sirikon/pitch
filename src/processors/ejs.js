const { Readable } = require('stream');
const ejs = require('ejs');
const print = require('../print');

module.exports = {
    ejsProcessor: {
        name: 'ejs',
        test(file) {
            return file.substr(-4) == '.ejs';
        },
        outputExtension: 'html',
        process({ absolutePath, data, params }) {
            var stream = new Readable();
            stream._read = function () {};

            ejs.renderFile(absolutePath, { data, params }, (err, result) => {
                if (err) {
                    print.error(err.stack);
                    stream.emit('error', err);
                    return;
                }
                stream.push(result);
                stream.push(null);
            });

            return stream;
        }
    }
};
