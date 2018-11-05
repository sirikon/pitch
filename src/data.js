const fs = require('fs');
const path = require('path');
const { filenameWithoutExtension, requireUncached } = require('./utils');

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
        const firstFile = matchingFiles[0];
        return path.join(directory, firstFile);
    }

    return null;
}

function readContent(filePath) {
    const extension = path.extname(filePath);

    if (extension === '.js') {
        return requireUncached(path.resolve(filePath)).data;
    }

    const content = fs.readFileSync(filePath, { encoding: 'utf8' });

    switch(extension) {
    case '.json':
        return JSON.parse(content);
    default:
        return content;
    }
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

                const currentFilePath = joinPath([dataBaseDir].concat(currentDataPath));

                if (fileIsDirectory(currentFilePath)) {
                    return createDataProxy(currentDataPath, dataBaseDir);
                }

                const currentDirectoryPath = joinPath([dataBaseDir].concat(previousDataPath));
                const matchingFile = getMatchingFileInDirectory(propName, currentDirectoryPath);

                if (!matchingFile) {
                    throw new Error(`Data not found: ${currentDataPath.join('.')}`);
                }

                return readContent(matchingFile);
            }
            return target[propName];
        }
    });
}

function init(dataBaseDir) {
    return createDataProxy(null, dataBaseDir);
}

module.exports = { init };
