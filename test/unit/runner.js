const assert = require('assert');
const EventEmitter = require('events');
const { Runner } = require('../../out/pitch/runner');

const processors = [
	{
		name: 'sass',
		test(file) {
			return file.substr(-5) == '.scss';
		},
		outputExtension: 'css'
	},
	{
		name: 'ejs',
		test(file) {
			return file.substr(-4) == '.ejs';
		},
		outputExtension: 'html'
	}
];

function createInputMock() {
	return {
		events: new EventEmitter(),
		run() {}
	};
}

describe('Runner', function() {
	it('should map correctly a single file once', function() {
		var input = createInputMock();
		var runner = new Runner(input);
		input.events.emit('add', ['index.html']);
		assert.deepEqual(runner.router(), {
			'index.html': { in: 'index.html', process: null }
		});
	});
	it('should map correctly a single file twice', function() {
		var input = createInputMock();
		var runner = new Runner(input);
		input.events.emit('add', ['index.html']);
		input.events.emit('add', ['index.html']);
		assert.deepEqual(runner.router(), {
			'index.html': { in: 'index.html', process: null }
		});
	});
	it('should map correctly multiple files, multiple times', function() {
		var input = createInputMock();
		var runner = new Runner(input);
		input.events.emit('add', ['index.html', 'style.css']);
		input.events.emit('add', ['index.html']);
		input.events.emit('add', ['style.css']);
		assert.deepEqual(runner.router(), {
			'index.html': { in: 'index.html', process: null },
			'style.css': { in: 'style.css', process: null }
		});
	});
	it('should map correctly multiple files, multiple times, with deep files', function() {
		var input = createInputMock();
		var runner = new Runner(input);
		input.events.emit('add', ['index.html', 'style.css']);
		input.events.emit('add', ['index.html', 'assets/manifest.json']);
		input.events.emit('add', ['style.css']);
		assert.deepEqual(runner.router(), {
			'index.html': { in: 'index.html', process: null },
			'style.css': { in: 'style.css', process: null },
			'assets/manifest.json': { in: 'assets/manifest.json', process: null }
		});
	});
	it('should be able to remove an existing file', function() {
		var input = createInputMock();
		var runner = new Runner(input);
		input.events.emit('add', ['index.html', 'style.css']);
		input.events.emit('remove', ['index.html']);
		assert.deepEqual(runner.router(), {
			'style.css': { in: 'style.css', process: null }
		});
	});
	it('should be able to use processors', function() {
		var input = createInputMock();
		var runner = new Runner(input, processors);
		input.events.emit('add', ['style.scss', 'deep/main.scss']);
		assert.deepEqual(runner.router(), {
			'style.css': { in: 'style.scss', process: 'sass' },
			'deep/main.css': { in: 'deep/main.scss', process: 'sass' }
		});
	});
	it('should be able to remove processed files', function() {
		var input = createInputMock();
		var runner = new Runner(input, processors);
		input.events.emit('add', ['style.scss']);
		assert.deepEqual(runner.router(), {
			'style.css': { in: 'style.scss', process: 'sass' }
		});
		input.events.emit('remove', ['style.scss']);
		assert.deepEqual(runner.router(), {});
	});
	it('should be able to react to file rename (or replacement)', function() {
		var input = createInputMock();
		var runner = new Runner(input, processors);
		input.events.emit('add', ['index.html']);
		assert.deepEqual(runner.router(), {
			'index.html': { in: 'index.html', process: null }
		});
		input.events.emit('add', ['index.ejs']);
		input.events.emit('remove', ['index.html']);
		assert.deepEqual(runner.router(), {
			'index.html': { in: 'index.ejs', process: 'ejs' }
		});
	});
	describe('Routing', function() {
		it('should have a method called "routes" which returns the current mapped routes.', function() {
			var input = createInputMock();
			var runner = new Runner(input, processors);
			input.events.emit('add', ['index.ejs', 'about.html', 'style.scss']);

			assert.deepEqual(runner.routes(), [
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
		describe('Custom Router', function() {
			it('should accept an empty object as undefined custom router', function() {
				var input = createInputMock();
				var runner = new Runner(input, processors, () => null);
				input.events.emit('add', ['index.ejs', 'about.html', 'style.scss']);
    
				assert.equal(runner.routeExists('index.html'), true);
				assert.equal(runner.routeExists('about.html'), true);
				assert.equal(runner.routeExists('style.css'), true);
				assert.equal(runner.routeExists('a.html'), false);
			});
			it('should be modified by passing a custom router', function() {
				var input = createInputMock();
				var runner = new Runner(input, processors, () => { return {
					custom: () => {
						return {
							'a.html': { target: 'index.ejs' },
						};
					}
				};});
				input.events.emit('add', ['index.ejs', 'about.html', 'style.scss', '_src/testing.ejs']);
    
				assert.equal(runner.routeExists('index.html'), true);
				assert.equal(runner.routeExists('about.html'), true);
				assert.equal(runner.routeExists('style.css'), true);
				assert.equal(runner.routeExists('_src/testing.html'), true);
				assert.equal(runner.routeExists('a.html'), true);
			});
			it('should be modified by passing a custom router which also disables automatic routing', function() {
				var input = createInputMock();
				var runner = new Runner(input, processors, () => { return {
					auto: false,
					custom: () => {
						return {
							'a.html': { target: 'index.ejs' },
						};
					}
				};});
				input.events.emit('add', ['index.ejs', 'about.html', 'style.scss', '_src/testing.ejs']);
    
				assert.equal(runner.routeExists('index.html'), false);
				assert.equal(runner.routeExists('about.html'), false);
				assert.equal(runner.routeExists('style.css'), false);
				assert.equal(runner.routeExists('_src/testing.ejs'), false);
				assert.equal(runner.routeExists('a.html'), true);
			});
			it('should be modified by passing a custom router which also excludes a folder', function() {
				var input = createInputMock();
				var runner = new Runner(input, processors, () => { return {
					auto: {
						exclude: '_src'
					},
					custom: () => {
						return {
							'a.html': { target: 'index.ejs' },
						};
					}
				};});
				input.events.emit('add', ['index.ejs', 'about.html', 'style.scss', '_src/testing.ejs']);
    
				assert.equal(runner.routeExists('index.html'), true);
				assert.equal(runner.routeExists('about.html'), true);
				assert.equal(runner.routeExists('style.css'), true);
				assert.equal(runner.routeExists('_src/testing.ejs'), false);
				assert.equal(runner.routeExists('a.html'), true);
			});
		});
        
	});
});
