const { run } = require('./src/filesystemRunner');
const { plan } = require('./src/executionPlanner');

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

run('./src', './dist', plan(walkSync('./src')))
