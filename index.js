const { FilesystemInput } = require('./src/filesystemInput');
const { sassProcessor } = require('./src/processors/sass');
const { ejsProcessor } = require('./src/processors/ejs');
const { filesystemOutput } = require('./src/filesystemOutput');
const { HttpOutput } = require('./src/httpOutput');
const { customRouterProvider } = require('./src/customRouterProvider');
const { Runner } = require('./src/runner');

const version = require('./package.json').version;

function buildRunner() {
    const filesystemInput = new FilesystemInput('./src');
    return new Runner(filesystemInput, [sassProcessor, ejsProcessor], customRouterProvider);
}

function build() {
    filesystemOutput('./dist', buildRunner());
}

function serve(options) {
    new HttpOutput(options, buildRunner()).run();
}

module.exports = { build, serve, version };
