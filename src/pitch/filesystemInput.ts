import * as chokidar from 'chokidar';
import * as EventEmitter from 'events';
import * as fs from 'fs';
import * as path from 'path';
import { IInput } from './models';

export class FilesystemInput implements IInput {
	public events = new EventEmitter();
	private srcDir: string;
	private watcher: chokidar.FSWatcher;

	constructor(srcDir: string) {
		this.srcDir = path.resolve(srcDir);
	}

	public run() {
		this.watcher = chokidar.watch(this.srcDir);
		this.watcher
			.on('all', (event, rawPath) => {
				const filePath = path.relative(this.srcDir, rawPath);
				switch (event) {
				case 'add': this.events.emit('add', [filePath]); break;
				case 'unlink': this.events.emit('remove', [filePath]); break;
				}
			})
			.on('ready', () => {
				this.events.emit('ready');
			});
	}

	public stop() {
		if (this.watcher) {
			this.watcher.close();
		}
	}

	public read(filePath: string) {
		return {
			absolutePath: path.resolve(path.join(this.srcDir, filePath)),
			readStream: fs.createReadStream(path.join(this.srcDir, filePath)),
		};
	}
}
