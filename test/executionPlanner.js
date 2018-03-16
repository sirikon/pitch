const assert = require('assert');
const { plan } = require('../src/executionPlanner');

describe('Execution Planner', function() {
    describe('.plan()', function() {
        it('should throw exception when using without parameters', function() {
            assert.throws(() => {
                plan()
            }, (err) => err.message === 'No file list provided')
        })
        it('should return an empty execution plan with empty array input', function() {
            assert.deepEqual(plan([]), []);
        });
        it('should leave an .html file as it is', function() {
            assert.deepEqual(plan([
                'index.html'
            ]),[
                { in: 'index.html', process: null, out: 'index.html' }
            ])
        })
        it('should leave an multiple final files as it is', function() {
            assert.deepEqual(plan([
                'index.html',
                'image.png',
                'assets/thing.svg'
            ]),[
                { in: 'index.html', process: null, out: 'index.html' },
                { in: 'image.png', process: null, out: 'image.png' },
                { in: 'assets/thing.svg', process: null, out: 'assets/thing.svg' }
            ])
        })
    });
});
