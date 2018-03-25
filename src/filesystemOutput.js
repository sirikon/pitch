const path = require('path');
const fs = require('fs');

function ensureFolderExists(folderPath) {
    if (!fs.existsSync(folderPath)){
        fs.mkdirSync(folderPath);
    }
}

function filesystemOutput(distDir, runner) {
    runner.isReady().then(() => {
        ensureFolderExists(distDir);
        var executionPlan = Object.keys(runner.fileOutputIndex).map(k => runner.fileOutputIndex[k]);
        executionPlan.forEach(step => {
            var distPath = path.join(distDir, step.out);
            ensureFolderExists(path.dirname(distPath));
            var writeStream = fs.createWriteStream(path.join(distDir, step.out));
            runner.process(step.out).pipe(writeStream);
        });
        runner.stop();
    });
}

module.exports = { filesystemOutput }
