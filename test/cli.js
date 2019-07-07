const assert = require('assert');
const cli = require('../src/cli');

describe('CLI', function() {
	describe('parseArgs()', function() {
		it('should parse correctly an empty string', function() {
			assert.deepEqual(cli.parseArgs([]), {
				command: 'help',
				flags: {}
			});
		});
		it('should parse correctly a string with a single command', function() {
			assert.deepEqual(cli.parseArgs(['run']), {
				command: 'run',
				flags: {}
			});
		});
		it('should parse correctly a string with a single flag', function() {
			assert.deepEqual(cli.parseArgs(['-v']), {
				command: 'help',
				flags: {
					v: true
				}
			});
		});
		it('should parse correctly a string with a single command and flag', function() {
			assert.deepEqual(cli.parseArgs(['serve', '-h']), {
				command: 'serve',
				flags: {
					h: true
				}
			});
		});
		it('should parse correctly a string with a single command and flag', function() {
			assert.deepEqual(cli.parseArgs(['serve', '--host', '0.0.0.0']), {
				command: 'serve',
				flags: {
					host: '0.0.0.0'
				}
			});
		});
		it('should parse correctly a string with a single command and two flags', function() {
			assert.deepEqual(cli.parseArgs(['serve', '--host', '0.0.0.0', '--port', '8080']), {
				command: 'serve',
				flags: {
					host: '0.0.0.0',
					port: '8080'
				}
			});
		});
	});

	describe('executeAppWithArguments()', function() {
		it('should run the requested command', function() {
			let actionRan = false;
			const app = {
				commands: {
					test: {
						action: () => {
							actionRan = true;
						}
					}
				}
			};
			const args = {
				command: 'test'
			};
			cli.executeAppWithArguments(app, args);
			assert.equal(actionRan, true);
		});
		it('should run the requested command with default flags', function() {
			let receivedFlags = null;
			const app = {
				commands: {
					test: {
						flags: {
							flagOne: { default: 'foo' }
						},
						action: (flags) => {
							receivedFlags = flags;
						}
					}
				}
			};
			const args = {
				command: 'test',
				flags: {}
			};
			cli.executeAppWithArguments(app, args);
			assert.deepEqual(receivedFlags, {
				flagOne: 'foo'
			});
		});

		it('should run the requested command with given flags over default ones and ignore others', function() {
			let receivedFlags = null;
			const app = {
				commands: {
					test: {
						flags: {
							flagOne: { default: 'foo' }
						},
						action: (flags) => {
							receivedFlags = flags;
						}
					}
				}
			};
			const args = {
				command: 'test',
				flags: {
					flagOne: 'bar',
					flagTwo: 'ignored'
				}
			};
			cli.executeAppWithArguments(app, args);
			assert.deepEqual(receivedFlags, {
				flagOne: 'bar'
			});
		});
	});
});
