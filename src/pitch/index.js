const { FilesystemInput } = require('./filesystemInput');
const { sassProcessor } = require('./processors/sass');
const { ejsProcessor } = require('./processors/ejs');
const { filesystemOutput } = require('./filesystemOutput');
const { HttpOutput } = require('./httpOutput');
const { customRouterProvider } = require('./customRouterProvider');
const { Runner } = require('./runner');

const debug = require('./debug');

const version = require('../../package.json').version;

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
