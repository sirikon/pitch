const http = require('http');
const path = require('path');

const mimeTypes = require('mime-types');

function HttpOutput (options, runner) {
    this.options = options;
    this.runner = runner;
}

function getFilePathFromRequest(req) {
    var file = req.url.substr(1);
    if (file === '') {
        file = 'index.html';
    }
    return file.replace(/\//g, path.sep);
}

HttpOutput.prototype.run = function() {
    const server = http.createServer((req, res) => {
        res.statusCode = 200;
        var filePath = getFilePathFromRequest(req);

        if (!this.runner.fileOutputIndex[filePath]) {
            res.statusCode = 404;
            res.end();
            return;
        }

        var contentType = mimeTypes.lookup(filePath);
        if (contentType) {
            res.setHeader('Content-Type', contentType);
        }

        try {
            res.statusCode = 200;
            this.runner.process(filePath).pipe(res);
        } catch (err) {
            res.statusCode = 500;
            res.end(err.stack);
        }
    });
    
    server.listen(this.options.port, this.options.host, () => {
        console.log(`Development server running on http://${this.options.host}:${this.options.port}/`);
    });
}

module.exports = { HttpOutput };
