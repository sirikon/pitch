const fs = require('fs');
const path = require('path');

const { filenameWithoutExtension } = require('./utils');
const dataReaders = require('./data-readers/index');

const DATA_PATH_SYMBOL = Symbol('Data Path');
const DATA_BASE_DIR_SYMBOL = Symbol('Data Base Dir');

function createDataProxy(dataPath, dataBaseDir) {
	if (!dataBaseDir) {
		throw new Error('Unspecified base dir.');
	}
	let baseObject = {
		[DATA_PATH_SYMBOL]: dataPath,
		[DATA_BASE_DIR_SYMBOL]: dataBaseDir,
	};
	return new Proxy(baseObject, {
		has: () => true,
		ownKeys: (target) => {
			const dataBaseDir = target[DATA_BASE_DIR_SYMBOL];
			const dataPath = target[DATA_PATH_SYMBOL];
			return getDirectoryFilesNames(joinPath([dataBaseDir].concat(dataPath)));
		},
		getOwnPropertyDescriptor: () => {
			return {
				enumerable: true,
				configurable: true,
			};
		},
		get(target, propName, receiver) {
			if (typeof propName === 'string') {
				const dataBaseDir = target[DATA_BASE_DIR_SYMBOL];
				const previousDataPath = target[DATA_PATH_SYMBOL];
				const dataPath = previousDataPath.concat(propName);

				const currentFilePath = joinPath([dataBaseDir].concat(dataPath));

				if (fileIsDirectory(currentFilePath)) {
					return createDataProxy(dataPath, dataBaseDir);
				}

				const currentDirectoryPath = joinPath([dataBaseDir].concat(previousDataPath));
				const matchingFile = getMatchingFileInDirectory(propName, currentDirectoryPath);

				if (!matchingFile) {
					throw new Error(`Data not found: ${dataPath.join('.')}`);
				}

				return readContent(matchingFile, receiver);
			}
			return target[propName];
		},
	});
}

const joinPath = (chunks) => path.join.apply(null, chunks);
const getDirectoryFiles = (directoryPath) => fs.readdirSync(directoryPath);
const fileIsDirectory = (filePath) =>
	fs.existsSync(filePath) &&
    fs.statSync(filePath).isDirectory();

function getDirectoryFilesNames(directoryPath) {
	return getDirectoryFiles(directoryPath)
		.map((fileName) => {
			var dotIndex = fileName.lastIndexOf('.');
			if (dotIndex === 0) {
				return null;
			}
			if (dotIndex > 0) {
				return fileName.split('.').slice(0, -1).join('.');
			}
			return fileName;
		}).filter(name => name !== null);
}

function getMatchingFileInDirectory(name, directory) {
	var matchingFiles = getDirectoryFiles(directory)
		.filter(f => filenameWithoutExtension(f) === name);

	if (matchingFiles.length > 0) {
		const firstFile = matchingFiles[0];
		return path.join(directory, firstFile);
	}

	return null;
}

function readContent(filePath, parentData) {
	return dataReaders.read(filePath, parentData);
}

function init(dataBaseDir) {
	return createDataProxy([], dataBaseDir);
}

module.exports = { init };
