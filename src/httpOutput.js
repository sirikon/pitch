const http = require('http');
const path = require('path');

const colors = require('colors/safe');
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

        if (!this.runner.routeExists(filePath)) {
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
        console.log(`${colors.bold('pitch')} ${colors.bold(colors.cyan('server'))} running.`);
        console.log(`http://${colors.bold(colors.blue(this.options.host))}:${colors.bold(colors.blue(this.options.port))}/`);
    });
};

module.exports = { HttpOutput };
