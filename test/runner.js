const assert = require('assert');
const { Runner } = require('../src/runner');

const processors = [
    {
        name: 'sass',
        test(file) {
            return file.substr(-5) == '.scss'
        },
        outputExtension: 'css'
    }
];

describe('Runner', function() {
    it('should map correctly a single file once', function() {
        var runner = new Runner();
        runner.in(['index.html']);
        assert.deepEqual(runner.fileOutputIndex, {
            'index.html': { in: 'index.html', process: null, out: 'index.html' }
        });
    });
    it('should map correctly a single file twice', function() {
        var runner = new Runner();
        runner.in(['index.html']);
        runner.in(['index.html']);
        assert.deepEqual(runner.fileOutputIndex, {
            'index.html': { in: 'index.html', process: null, out: 'index.html' }
        });
    });
    it('should map correctly multiple files, multiple times', function() {
        var runner = new Runner();
        runner.in(['index.html', 'style.css']);
        runner.in(['index.html']);
        runner.in(['style.css']);
        assert.deepEqual(runner.fileOutputIndex, {
            'index.html': { in: 'index.html', process: null, out: 'index.html' },
            'style.css': { in: 'style.css', process: null, out: 'style.css' }
        });
    });
    it('should be able to remove an existing file', function() {
        var runner = new Runner();
        runner.in(['index.html', 'style.css']);
        runner.remove(['index.html']);
        assert.deepEqual(runner.fileOutputIndex, {
            'style.css': { in: 'style.css', process: null, out: 'style.css' }
        });
    });
    it('should be able to use processors', function() {
        var runner = new Runner(processors);
        runner.in(['style.scss']);
        assert.deepEqual(runner.fileOutputIndex, {
            'style.css': { in: 'style.scss', process: 'sass', out: 'style.css' }
        });
    });
    it('should be able to remove processed files', function() {
        var runner = new Runner(processors);
        runner.in(['style.scss']);
        assert.deepEqual(runner.fileOutputIndex, {
            'style.css': { in: 'style.scss', process: 'sass', out: 'style.css' }
        });
        runner.remove(['style.scss']);
        assert.deepEqual(runner.fileOutputIndex, {});
    });
});
