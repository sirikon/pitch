import * as fs from 'fs';
import * as path from 'path';

import { Runner } from './runner';
import * as utils from './utils';

export async function filesystemOutput(distDir: string, runner: Runner) {
	ensureFolderExists(distDir);
	await runner.isReady();

	const routes = runner.getRoutes();

	runner.getRoutes().forEach((route) => {
		const distPath = path.join(distDir, route);
		ensureFolderExists(path.dirname(distPath));
		const writeStream = fs.createWriteStream(distPath);
		runner.process(route).pipe(writeStream);
	});

	runner.stop();
}

function ensureFolderExists(folderPath: string) {
	if (fs.existsSync(folderPath)) { return; }
	utils.recursiveMkdir(folderPath);
}
