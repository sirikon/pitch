const http = require('http');
const path = require('path');

const hostname = '127.0.0.1';
const port = 3000;

function HttpOutput (runner) {
    this.runner = runner;
}

function getFilePathFromRequest(req) {
    var file = req.url.substr(1);
    if (file === '') {
        file = 'index.html';
    }
    return file.replace('/', path.sep);
}

HttpOutput.prototype.run = function() {
    const server = http.createServer((req, res) => {
        res.statusCode = 200;
        var filePath = getFilePathFromRequest(req);

        if (!this.runner.fileOutputIndex[filePath]) {
            res.statusCode = 404;
            res.end();
        }

        try {
            res.statusCode = 200;
            this.runner.process(filePath).pipe(res);
        } catch (err) {
            res.statusCode = 500;
            res.end(err.stack);
        }
    });
    
    server.listen(port, hostname, () => {
        console.log(`Development server running on http://${hostname}:${port}/`);
    });
}

module.exports = { HttpOutput };
