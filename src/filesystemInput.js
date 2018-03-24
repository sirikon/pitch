const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

function walkSync(dir, fileList, currentPath) {
    var files = fs.readdirSync(dir);
    fileList = fileList || [];
    currentPath = currentPath || '';
    files.forEach(function(file) {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            if (currentPath === '' && file === '_src') return;
            fileList = walkSync(path.join(dir, file, path.sep), fileList, path.join(currentPath, file));
        }
        else {
            fileList.push(path.join(currentPath, file));
        }
    });
    return fileList;
};

function FilesystemInput (srcDir) {
    this.srcDir = srcDir;
    this.events = new EventEmitter();
}

FilesystemInput.prototype.run = function() {
    var files = walkSync(this.srcDir);
    this.events.emit('in', files);
}

FilesystemInput.prototype.read = function(file) {
    return {
        absolutePath: path.resolve(path.join(this.srcDir, file)),
        readStream: fs.createReadStream(path.join(this.srcDir, file))
    }
}

module.exports = { FilesystemInput };
