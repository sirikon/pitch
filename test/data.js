const assert = require('assert');
const path = require('path');
const { init } = require('../src/data');

function pathToTestFolder(folderName) {
    return path.join(__dirname, 'data-folders', folderName);
}

describe('Data', function() {
    it ('should throw exception when base dir is invalid', function() {
        let exception = null;
        try {
            var data = init();
        }
        catch(err) {
            exception = err;
        }
        assert.notEqual(exception, null);
    })
    it ('should work with simple JSON object', function() {
        var data = init(pathToTestFolder('single-json'));
        assert.deepEqual(data.people, [
            'Phineas', 'Ferb'
        ]);
    });
    it ('should work with a deep JSON', function() {
        var data = init(pathToTestFolder('deep-json'));
        assert.deepEqual(data.a.b.c, {
            name: 'Test c.json'
        });
    });
    it ('should work with a deep JS file', function() {
        var data = init(pathToTestFolder('deep-js'));
        assert.deepEqual(data.a.b.c, {
            name: 'Test c.js'
        });
    });
    it('should throw an error when accessing a non-existent path', function() {
        let exception = null;
        try {
            var data = init(pathToTestFolder('deep-js'));
            var content = data.missing;
        }
        catch(err) {
            exception = err;
        }
        assert.notEqual(exception, null);
        assert.equal(exception.name, 'Error');
        assert.equal(exception.message, 'Data not found: missing');
    });
    it('should work with plaintext', function() {
        var data = init(pathToTestFolder('plain-text'));
        assert.equal(data.info, 'Information');
    });
});