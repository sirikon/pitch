const { Readable } = require('stream');
const ejs = require('ejs');

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
                if (err) throw err;
                stream.push(result);
                stream.push(null);
            });

            return stream;
        }
    }
};
