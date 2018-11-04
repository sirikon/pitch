const path = require('path');
const fs = require('fs');

const utils = require('./utils');

function ensureFolderExists(folderPath) {
    if (!fs.existsSync(folderPath)){
        utils.recursiveMkdir(folderPath);
    }
}

function filesystemOutput(distDir, runner) {
    runner.isReady().then(() => {
        ensureFolderExists(distDir);
        var routes = runner.routes();
        routes.forEach(route => {
            var distPath = path.join(distDir, route);
            ensureFolderExists(path.dirname(distPath));
            var writeStream = fs.createWriteStream(path.join(distDir, route));
            runner.process(route).pipe(writeStream);
        });
        runner.stop();
    })
    .then(() => {}, (err) => {
        console.log(err);
        runner.stop();
        process.exit(1);
    });
}

module.exports = { filesystemOutput }
