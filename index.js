const { FilesystemInput } = require('./src/filesystemInput');
const { filesystemOutput } = require('./src/filesystemOutput');
const { Runner } = require('./src/runner');

var runner = new Runner();
var filesystemInput = new FilesystemInput('./src', runner);
filesystemInput.run();
var executionPlan = Object.keys(runner.fileOutputIndex).map(k => runner.fileOutputIndex[k]);

filesystemOutput('./src', './dist', executionPlan)
