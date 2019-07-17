import * as fs from 'fs';
import * as path from 'path';

import { FilesystemInput } from './filesystemInput';
import { filesystemOutput } from './filesystemOutput';

import { HttpOutput } from './httpOutput';

import { ejsProcessor } from './processors/ejs';
import { sassProcessor } from './processors/sass';

import { customRouterProvider } from './customRouterProvider';

import { Runner } from './runner';

import * as debug from './debug';

const packageData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../package.json'), { encoding: 'utf8' }));

function buildRunner() {
	const filesystemInput = new FilesystemInput('./src');
	return new Runner(filesystemInput, [sassProcessor, ejsProcessor], customRouterProvider);
}

export const version = packageData.version;

export async function build(options: { [key: string]: any }) {
	if (options.debug) { debug.enable(); }
	await filesystemOutput('./dist', buildRunner());
	if (options.debug) { debug.display(); }
}

export function serve(options: { [key: string]: any }) {
	new HttpOutput(options, buildRunner()).run();
}
