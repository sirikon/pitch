const path = require('path');
const { requireUncached } = require('../utils');

const debug = require('../debug');

module.exports = {
	fileExtension: '.js',
	read(filePath, parentData) {
		debug.track('require_js', filePath);
		return requireUncached(path.resolve(filePath)).data(parentData);
	}
};
