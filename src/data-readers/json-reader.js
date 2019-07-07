const fs = require('fs');

const debug = require('../debug');

module.exports = {
	fileExtension: '.json',
	read(filePath) {
		debug.track('read_file_json', filePath);
		const content = fs.readFileSync(filePath, { encoding: 'utf8' });
		return JSON.parse(content);
	}
};
