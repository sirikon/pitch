const fs = require('fs');
const path = require('path');

const { FilesystemInput } = require('./src/filesystemInput');
const { sassProcessor } = require('./src/processors/sass');
const { ejsProcessor } = require('./src/processors/ejs');
const { filesystemOutput } = require('./src/filesystemOutput');
const { HttpOutput } = require('./src/httpOutput');
const { Runner } = require('./src/runner');

const version = require('./package.json').version;

function getRouter() {
    const routerPath = path.join(process.cwd(), 'router.js');
    const fileExists = fs.existsSync(routerPath);
    if (fileExists) {
        return require(routerPath);
    }
    return null;
}

function buildRunner() {
    const filesystemInput = new FilesystemInput('./src');
    return new Runner(filesystemInput, [sassProcessor, ejsProcessor], getRouter());
}

function build() {
    filesystemOutput('./dist', buildRunner())
}

function serve(options) {
    new HttpOutput(options, buildRunner()).run();
}

module.exports = { build, serve, version }
