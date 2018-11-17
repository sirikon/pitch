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
    });
});
