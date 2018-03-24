const { FilesystemInput } = require('./src/filesystemInput');
const { sassProcessor } = require('./src/processors/sass');
const { filesystemOutput } = require('./src/filesystemOutput');
const { Runner } = require('./src/runner');

var filesystemInput = new FilesystemInput('./src');
var runner = new Runner(filesystemInput, [sassProcessor]);
filesystemOutput('./dist', runner)
