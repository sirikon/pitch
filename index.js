const { FilesystemInput } = require('./src/filesystemInput');
const { sassProcessor } = require('./src/processors/sass');
// const { filesystemOutput } = require('./src/filesystemOutput');
const { HttpOutput } = require('./src/httpOutput');
const { Runner } = require('./src/runner');

var filesystemInput = new FilesystemInput('./src');
var runner = new Runner(filesystemInput, [sassProcessor]);
// filesystemOutput('./dist', runner)
var httpOutput = new HttpOutput(runner);
httpOutput.run();
