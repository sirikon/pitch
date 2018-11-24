const sass = require('node-sass');
const { Readable } = require('stream');
const print = require('../print');

module.exports = {
    sassProcessor: {
        name: 'sass',
        test(file) {
            return file.substr(-5) == '.scss';
        },
        outputExtension: 'css',
        process({ absolutePath }) {
            var stream = new Readable();
            stream._read = function () {};

            sass.render({
                file: absolutePath
            }, (err, result) => {
                if (err) {
                    print.error(err.formatted);
                    stream.emit('error', err);
                    return;
                }
                stream.push(result.css);
                stream.push(null);
            });
            
            return stream;
        }
    }
};
