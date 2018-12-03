const http = require('http');
const path = require('path');

const c = require('ansi-colors');
const mimeTypes = require('mime-types');

function HttpOutput (options, runner) {
    this.options = options;
    this.runner = runner;
}

function getFilePathFromRequest(req) {
    let file = req.url;
    if (path.extname(file) === '') {
        file = path.join(file, 'index.html');
    }
    return file.substr(1).replace(/\//g, path.sep);
}

function handleError(res, err, filePath) {
    res.statusCode = 500;
    res.end(err.formatted || err.stack);
    log(res.statusCode, filePath);
}

function log(code, url) {
    const date = new Date();
    const formattedDate = '[' + date.toISOString()
        .replace(/T/, ' ')
        .replace(/\..+/, '') + ':' + ('000' + date.getMilliseconds()).slice(-3) + ']';

    let codeColorFn = c.green;
    if (code >= 400 && code < 500) {
        codeColorFn = c.yellow;
    } else if (code >= 500) {
        codeColorFn = c.red;
    }

    const formattedCode = codeColorFn(`[${code}]`);
    console.log(`${c.gray(formattedDate)} ${formattedCode} ${url}`);
}

function preventCache(res) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
}

HttpOutput.prototype.run = function() {
    const server = http.createServer((req, res) => {
        preventCache(res);

        res.statusCode = 200;
        var filePath = getFilePathFromRequest(req);

        if (!this.runner.routeExists(filePath)) {
            res.statusCode = 404;
            res.end();
            log(res.statusCode, filePath);
            return;
        }

        var contentType = mimeTypes.lookup(filePath);
        if (contentType) {
            res.setHeader('Content-Type', contentType);
        }

        try {
            res.statusCode = 200;
            const processor = this.runner.process(filePath);
            processor.on('error', (err) => handleError(res, err, filePath));
            processor.pipe(res);
            processor.on('end', () => {
                log(res.statusCode, filePath);
            });
        } catch (err) {
            handleError(res, err, filePath);
        }
    });
    
    server.listen(this.options.port, this.options.host, () => {
        console.log(`${c.bold('pitch')} ${c.bold.cyan('server')} running.`);
        console.log(`http://${c.bold.blue(this.options.host)}:${c.bold.blue(this.options.port)}/`);
    });
};

module.exports = { HttpOutput };
