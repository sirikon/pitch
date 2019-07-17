import * as fs from 'fs';
import * as path from 'path';
import { requireUncached } from './utils';

export function customRouterProvider() {
	const routerPath = path.resolve(path.join(process.cwd(), 'router.js'));
	const fileExists = fs.existsSync(routerPath);
	if (fileExists) {
		return requireUncached(routerPath);
	}
	return null;
}
