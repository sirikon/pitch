const fs = require('fs');
const path = require('path');
const { filenameWithoutExtension } = require('./utils');

const DATA_DIR = './data';
const DATAPATH_SYMBOL = Symbol('Data Path');

function getDirectoryFiles(directoryPath) {
    return fs.readdirSync(directoryPath);
}

function getMatchingFileInDirectory(name, directory) {
    var matchingFiles = getDirectoryFiles(directory)
        .filter(f => filenameWithoutExtension(f) === name);
    
    if (matchingFiles.length > 0) {
        return matchingFiles[0];
    }

    return null;
}

function createDataProxy(dataPath) {
    return new Proxy({[DATAPATH_SYMBOL]: dataPath || []}, {
        has: () => true,
        get(target, prop) {
            if (typeof prop === 'string') {
                
                var filePath = path.join.apply(null, [DATA_DIR].concat(target[DATAPATH_SYMBOL], [prop]));

                if(fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
                    return createDataProxy(target[DATAPATH_SYMBOL].concat(prop));
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
