const assert = require('assert');
const { filenameWithoutExtension } = require('../src/utils');

describe('Utils', function() {
	describe('filenameWithoutExtension()', function() {
		it('should remove extensions from files', function() {
			assert.equal(filenameWithoutExtension('index.html'), 'index');
			assert.equal(filenameWithoutExtension('style.css'), 'style');
		});
		it('should remove extensions from files in a deep path', function() {
			assert.equal(filenameWithoutExtension('./assets/image.png'), './assets/image');
		});
		it('should return filenames without extensions equally', function() {
			assert.equal(filenameWithoutExtension('./assets/procfile'), './assets/procfile');
		});
		it('should work as expected with files starting with a dot', function() {
			assert.equal(filenameWithoutExtension('./assets/.gitignore'), './assets/.gitignore');
			assert.equal(filenameWithoutExtension('.gitignore'), '.gitignore');
		});
	});
});
