const http = require('http');
const path = require('path');

const hostname = '127.0.0.1';
const port = 3000;

function HttpOutput (runner) {
    this.runner = runner;
}

HttpOutput.prototype.run = function() {
    const server = http.createServer((req, res) => {
        res.statusCode = 200;
        var file = req.url.substr(1);
        if (file === '') {
            file = 'index.html';
        }
        file = file.replace('/', path.sep);
        this.runner.process(file).pipe(res);
    });
    
    server.listen(port, hostname, () => {
        console.log(`Development server running on http://${hostname}:${port}/`);
    });
}

module.exports = { HttpOutput };
