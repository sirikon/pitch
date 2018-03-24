const path = require('path');
const fs = require('fs');

function ensureFolderExists(folderPath) {
    if (!fs.existsSync(folderPath)){
        fs.mkdirSync(folderPath);
    }
}

function run(srcDir, distDir, executionPlan) {
    executionPlan.forEach(step => {
        if (step.process === null) {
            var srcPath = path.join(srcDir, step.in);
            var distPath = path.join(distDir, step.out);
            ensureFolderExists(path.dirname(distPath));
            var readStream = fs.createReadStream(path.join(srcDir, step.in));
            var writeStream = fs.createWriteStream(path.join(distDir, step.out));
            readStream.pipe(writeStream)
        }
    });
}

module.exports = { run }
