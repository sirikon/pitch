const { FilesystemInput } = require('./src/filesystemInput');
const { sassProcessor } = require('./src/processors/sass');
const { ejsProcessor } = require('./src/processors/ejs');
const { filesystemOutput } = require('./src/filesystemOutput');
const { HttpOutput } = require('./src/httpOutput');
const { Runner } = require('./src/runner');

var version = require('./package.json').version;

function buildRunner() {
    var filesystemInput = new FilesystemInput('./src');
    return new Runner(filesystemInput, [sassProcessor, ejsProcessor]);
}

function build() {
    filesystemOutput('./dist', buildRunner())
}

function serve() {
    new HttpOutput(buildRunner()).run();
}

module.exports = { build, serve, version }
