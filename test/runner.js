const assert = require('assert');
const EventEmitter = require('events');
const { Runner } = require('../src/runner');

const processors = [
    {
        name: 'sass',
        test(file) {
            return file.substr(-5) == '.scss'
        },
        outputExtension: 'css'
    },
    {
        name: 'ejs',
        test(file) {
            return file.substr(-4) == '.ejs'
        },
        outputExtension: 'html'
    }
];

function createInputMock() {
    return {
        events: new EventEmitter(),
        run() {}
    }
}

describe('Runner', function() {
    it('should map correctly a single file once', function() {
        var input = createInputMock();
        var runner = new Runner(input);
        input.events.emit('add', ['index.html']);
        assert.deepEqual(runner.fileOutputIndex, {
            'index.html': { in: 'index.html', process: null, out: 'index.html' }
        });
    });
    it('should map correctly a single file twice', function() {
        var input = createInputMock();
        var runner = new Runner(input);
        input.events.emit('add', ['index.html']);
        input.events.emit('add', ['index.html']);
        assert.deepEqual(runner.fileOutputIndex, {
            'index.html': { in: 'index.html', process: null, out: 'index.html' }
        });
    });
    it('should map correctly multiple files, multiple times', function() {
        var input = createInputMock();
        var runner = new Runner(input);
        input.events.emit('add', ['index.html', 'style.css']);
        input.events.emit('add', ['index.html']);
        input.events.emit('add', ['style.css']);
        assert.deepEqual(runner.fileOutputIndex, {
            'index.html': { in: 'index.html', process: null, out: 'index.html' },
            'style.css': { in: 'style.css', process: null, out: 'style.css' }
        });
    });
    it('should map correctly multiple files, multiple times, with deep files', function() {
        var input = createInputMock();
        var runner = new Runner(input);
        input.events.emit('add', ['index.html', 'style.css']);
        input.events.emit('add', ['index.html', 'assets/manifest.json']);
        input.events.emit('add', ['style.css']);
        assert.deepEqual(runner.fileOutputIndex, {
            'index.html': { in: 'index.html', process: null, out: 'index.html' },
            'style.css': { in: 'style.css', process: null, out: 'style.css' },
            'assets/manifest.json': { in: 'assets/manifest.json', process: null, out: 'assets/manifest.json' }
        });
    });
    it('should be able to remove an existing file', function() {
        var input = createInputMock();
        var runner = new Runner(input);
        input.events.emit('add', ['index.html', 'style.css']);
        input.events.emit('remove', ['index.html']);
        assert.deepEqual(runner.fileOutputIndex, {
            'style.css': { in: 'style.css', process: null, out: 'style.css' }
        });
    });
    it('should be able to use processors', function() {
        var input = createInputMock();
        var runner = new Runner(input, processors);
        input.events.emit('add', ['style.scss', 'deep/main.scss']);
        assert.deepEqual(runner.fileOutputIndex, {
            'style.css': { in: 'style.scss', process: 'sass', out: 'style.css' },
            'deep/main.css': { in: 'deep/main.scss', process: 'sass', out: 'deep/main.css' }
        });
    });
    it('should be able to remove processed files', function() {
        var input = createInputMock();
        var runner = new Runner(input, processors);
        input.events.emit('add', ['style.scss']);
        assert.deepEqual(runner.fileOutputIndex, {
            'style.css': { in: 'style.scss', process: 'sass', out: 'style.css' }
        });
        input.events.emit('remove', ['style.scss']);
        assert.deepEqual(runner.fileOutputIndex, {});
    });
    it('should be able to react to file rename (or replacement)', function() {
        var input = createInputMock();
        var runner = new Runner(input, processors);
        input.events.emit('add', ['index.html']);
        assert.deepEqual(runner.fileOutputIndex, {
            'index.html': { in: 'index.html', process: null, out: 'index.html' }
        });
        input.events.emit('add', ['index.ejs']);
        input.events.emit('remove', ['index.html']);
        assert.deepEqual(runner.fileOutputIndex, {
            'index.html': { in: 'index.ejs', process: 'ejs', out: 'index.html' }
        });
    });
    describe('Routing', function() {
        it('should have a method called "routes" which returns the current mapped routes.', function() {
            var input = createInputMock();
            var runner = new Runner(input, processors);
            input.events.emit('add', ['index.ejs', 'about.html', 'style.scss']);

            var routes = runner.routes();
            assert.deepEqual(routes, [
                'index.html', 'about.html', 'style.css'
            ]);
        });
        it('should have a method called "routeExists" which returns if a route exists or not.', function() {
            var input = createInputMock();
            var runner = new Runner(input, processors);
            input.events.emit('add', ['index.ejs', 'about.html', 'style.scss']);

            assert.equal(runner.routeExists('index.html'), true);
            assert.equal(runner.routeExists('about.html'), true);
            assert.equal(runner.routeExists('style.css'), true);
            assert.equal(runner.routeExists('other.html'), false);
        });
    });
});
