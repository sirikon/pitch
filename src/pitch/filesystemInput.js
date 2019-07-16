const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');
const chokidar = require('chokidar');

function FilesystemInput(srcDir) {
	this.srcDir = path.resolve(srcDir);
	this.events = new EventEmitter();
	this.watcher = null;
}

FilesystemInput.prototype.run = function() {
	this.startWatch();
};

FilesystemInput.prototype.stop = function() {
	this.stopWatch();
};

FilesystemInput.prototype.stopWatch = function() {
	if (this.watcher) {
		this.watcher.close();
	}
};

FilesystemInput.prototype.startWatch = function() {
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
};

FilesystemInput.prototype.read = function(file) {
	return {
		absolutePath: path.resolve(path.join(this.srcDir, file)),
		readStream: fs.createReadStream(path.join(this.srcDir, file)),
	};
};

module.exports = { FilesystemInput };
