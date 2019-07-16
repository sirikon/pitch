const fs = require('fs');
const path = require('path');
const { requireUncached } = require('./utils');

function customRouterProvider() {
	const routerPath = path.resolve(path.join(process.cwd(), 'router.js'));
	const fileExists = fs.existsSync(routerPath);
	if (fileExists) {
		return requireUncached(routerPath);
	}
	return null;
}

module.exports = { customRouterProvider };
