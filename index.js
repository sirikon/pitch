const { FilesystemInput } = require('./src/filesystemInput');
const { sassProcessor } = require('./src/processors/sass');
const { ejsProcessor } = require('./src/processors/ejs');
const { filesystemOutput } = require('./src/filesystemOutput');
const { HttpOutput } = require('./src/httpOutput');
const { customRouterProvider } = require('./src/customRouterProvider');
const { Runner } = require('./src/runner');

const debug = require('./src/debug');

const version = require('./package.json').version;

function buildRunner() {
    const filesystemInput = new FilesystemInput('./src');
    return new Runner(filesystemInput, [sassProcessor, ejsProcessor], customRouterProvider);
}

function build(options) {
    if (options.debug) {
        debug.enable();
    }
    filesystemOutput('./dist', buildRunner())
        .then(() => {
            if (options.debug) {
                debug.display();
            }
        });
}

function serve(options) {
    new HttpOutput(options, buildRunner()).run();
}

module.exports = { build, serve, version };
