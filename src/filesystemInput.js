const fs = require('fs');
const path = require('path');

function walkSync(dir, fileList) {
    var files = fs.readdirSync(dir);
    fileList = fileList || [];
    files.forEach(function(file) {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            fileList = walkSync(path.join(dir, file, path.sep), fileList);
        }
        else {
            fileList.push(file);
        }
    });
    return fileList;
};

function FilesystemInput (srcDir, runner) {
    this.srcDir = srcDir;
    this.runner = runner;
}

FilesystemInput.prototype.run = function() {
    this.runner.in(walkSync(this.srcDir));
}

module.exports = { FilesystemInput };
