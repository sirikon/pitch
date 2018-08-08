const fs = require('fs');
const path = require('path');
const { filenameWithoutExtension } = require('./utils');

const DATA_BASE_DIR = './data';
const DATA_PATH_SYMBOL = Symbol('Data Path');

const joinPath = (chunks) => path.join.apply(null, chunks);
const getDirectoryFiles = (directoryPath) => fs.readdirSync(directoryPath);
const fileIsDirectory = (filePath) => fs.existsSync(joinPath(filePath)) && fs.statSync(joinPath(filePath)).isDirectory();

function getMatchingFileInDirectory(name, directory) {
    var matchingFiles = getDirectoryFiles(directory)
        .filter(f => filenameWithoutExtension(f) === name);
    
    if (matchingFiles.length > 0) {
        return path.join(directory, matchingFiles[0]);
    }

    return null;
}

function requireUncached(modulePath){
    delete require.cache[require.resolve(modulePath)]
    return require(modulePath)
}

function createDataProxy(dataPath) {
    let baseObject = {
        [DATA_PATH_SYMBOL]: dataPath || []
    };
    return new Proxy(baseObject, {
        has: () => true,
        get(target, propName) {
            if (typeof propName === 'string') {
                const currentDataPath = target[DATA_PATH_SYMBOL];
                const nextDataPath = currentDataPath.concat(propName);
                
                if(fileIsDirectory(nextDataPath)) {
                    return createDataProxy(currentDataPath.concat(propName));
                } else {
                    var directory = joinPath([DATA_BASE_DIR].concat(currentDataPath));
                    var matchingFile = getMatchingFileInDirectory(propName, directory);

                    if (!matchingFile) {
                        throw new Error('Data not found:' + filePath);
                    }

                    var extension = path.extname(matchingFile);
                    
                    if (extension === '.js') {
                        return requireUncached(path.resolve(matchingFile)).data;
                    }

                    var content = fs.readFileSync(matchingFile, { encoding: 'utf8' });

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
