const fs = require('fs');
const path = require('path');
const { filenameWithoutExtension } = require('./utils');

const DATA_PATH_SYMBOL = Symbol('Data Path');
const DATA_BASE_DIR_SYMBOL = Symbol('Data Base Dir');

const joinPath = (chunks) => path.join.apply(null, chunks);
const getDirectoryFiles = (directoryPath) => fs.readdirSync(directoryPath);
const fileIsDirectory = (filePath) =>
    fs.existsSync(filePath) &&
    fs.statSync(filePath).isDirectory();

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

function createDataProxy(dataPath, dataBaseDir) {
    if (!dataBaseDir) {
        throw new Error('Unspecified base dir.');
    }
    let baseObject = {
        [DATA_PATH_SYMBOL]: dataPath || [],
        [DATA_BASE_DIR_SYMBOL]: dataBaseDir
    };
    return new Proxy(baseObject, {
        has: () => true,
        get(target, propName) {
            if (typeof propName === 'string') {
                const dataBaseDir = target[DATA_BASE_DIR_SYMBOL];
                const previousDataPath = target[DATA_PATH_SYMBOL];
                const currentDataPath = previousDataPath.concat(propName);
                const currentFilesystemPath = joinPath([dataBaseDir].concat(currentDataPath));

                if (fileIsDirectory(currentFilesystemPath)) {
                    return createDataProxy(currentDataPath, dataBaseDir);
                }

                const directory = joinPath([dataBaseDir].concat(previousDataPath));
                const matchingFile = getMatchingFileInDirectory(propName, directory);

                if (!matchingFile) {
                    throw new Error(`Data not found: ${currentDataPath.join('.')}`);
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
            return target[prop];
        }
    })
}

function init(dataBaseDir) {
    return createDataProxy(null, dataBaseDir);
}

module.exports = { init }
