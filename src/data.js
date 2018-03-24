const fs = require('fs');
const path = require('path');

const dataDir = './data';
var dataPathSymbol = Symbol('Data Path');

function getDirectoryFiles(directoryPath) {
    return fs.readdirSync(directoryPath);
}

function getMatchingFileInDirectory(name, directory) {
    var filesInDirectory = getDirectoryFiles(directory);
    var found = null;
    filesInDirectory.forEach((file) => {
        var lastDot = file.lastIndexOf('.');
        var fileName = null;
        if (lastDot > 0) {
            fileName = file.substr(0, lastDot);
        } else {
            fileName = file;
        }
        if (fileName === name) {
            found = file;
        }
    });
    return found;
}

function createDataProxy(dataPath) {
    return new Proxy({[dataPathSymbol]: dataPath || []}, {
        has: () => true,
        get(target, prop) {
            if (typeof prop === 'string') {
                
                var filePath = path.join.apply(null, [dataDir].concat(target[dataPathSymbol], [prop]));

                if(fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
                    return createDataProxy(target[dataPathSymbol].concat(prop));
                } else {
                    var directory = path.dirname(filePath);
                    var matchingFile = getMatchingFileInDirectory(prop, directory);

                    if (!matchingFile) {
                        throw new Error('Data not found:' + filePath);
                    }

                    var content = fs.readFileSync(path.join(directory, matchingFile), { encoding: 'utf8' });
                    var extension = path.extname(matchingFile);

                    if (extension === '.json') {
                        return JSON.parse(content);
                    }

                    return content;
                }
            }
            return target[prop];
        }
    })
}

module.exports = { data: createDataProxy() }
