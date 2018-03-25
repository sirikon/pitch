const sass = require('node-sass');
const { Readable } = require('stream');

module.exports = {
    sassProcessor: {
        name: 'sass',
        test(file) {
            return file.substr(-5) == '.scss'
        },
        outputExtension: 'css',
        process({ absolutePath, readStream }) {
            var stream = new Readable();
            stream._read = function () {};

            sass.render({
                file: absolutePath
            }, (err, result) => {
                if (err) throw err;
                stream.push(result.css);
                stream.push(null);
            });
            
            return stream;
        }
    }
}
