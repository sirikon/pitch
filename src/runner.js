const path = require('path');

const { init } = require('./data');
const data = init('./data');

function validateFiles(files) {
    if (files === null || files === undefined) throw new Error("No file list provided");
}

function setFileExtension(file, extension) {
    var lastDot = file.lastIndexOf('.');
    return file.substr(0, lastDot) + '.' + extension;
}

function Runner(input, processors, customRouter) {
    this.input = input;
    this.processors = processors || [];
    this.customRouter = customRouter || null;

    this.readyPromise = null;
    this.readyPromiseResolver = null;
    this.processorsIndex = {};
    this.fileInputIndex = {};

    this.generateProcessorsIndex();
    this.setupReadyPromise();
    this.bindEvents();

    this.input.run();
}

Runner.prototype.setupReadyPromise = function() {
    this.readyPromise = new Promise((resolve) => {
        this.readyPromiseResolver = resolve;
    });
}

Runner.prototype.bindEvents = function() {
    this.input.events.on('add', this.add.bind(this));
    this.input.events.on('remove', this.remove.bind(this));
    this.input.events.on('ready', () => {
        this.readyPromiseResolver();
    });
}

Runner.prototype.add = function(files) {
    validateFiles(files);
    files.forEach((file) => {
        var mapping = {
            in: file,
            process: null
        };

        var i = 0;
        var found = false;
        while(i < this.processors.length && !found) {
            var processor = this.processors[i];
            if (processor.test(file)) {
                mapping.process = processor.name;
                found = true;
            }
            i++;
        }
        
        this.fileInputIndex[mapping.in] = mapping;
    });
}

Runner.prototype.remove = function(files) {
    validateFiles(files);
    files.forEach((file) => {
        delete this.fileInputIndex[file];
    });
}

Runner.prototype.process = function(route) {
    var mapping = this.route(route);
    var file = this.input.read(mapping.in);
    file.data = data;
    file.params = mapping.params;
    var processor = this.processorsIndex[mapping.process];
    if (processor) {
        return processor.process(file);
    } else {
        return file.readStream;
    }
}

Runner.prototype.generateProcessorsIndex = function() {
    this.processors.forEach((processor) => {
        this.processorsIndex[processor.name] = processor;
    });
}

Runner.prototype.isReady = function() {
    return this.readyPromise;
}

Runner.prototype.stop = function() {
    this.input.stop();
}

Runner.prototype.getAutoRouterExcludedPath = function() {
    if (this.customRouter && this.customRouter.auto) {
        let excludedPath = this.customRouter.auto.exclude;
        if (excludedPath[excludedPath.length - 1] != path.sep) {
            excludedPath += path.sep;
        }
        return this.customRouter.auto.exclude;
    }
    return null;
}

Runner.prototype.isAutoRoutingEnabled = function() {
    if (!this.customRouter) {
        return true;
    }

    if (this.customRouter.auto === false) {
        return false;
    }

    return true;
}

Runner.prototype.router = function() {
    var result = {};

    if (this.isAutoRoutingEnabled()) {
        Object.keys(this.fileInputIndex)
            .forEach(file => {
                if (file.startsWith(this.getAutoRouterExcludedPath())) {
                    return;
                }
                const mapping = this.fileInputIndex[file];
                const processor = this.processorsIndex[mapping.process];
                const path = processor ? setFileExtension(file, processor.outputExtension) : file;
                result[path] = mapping;
            });
    }

    if (this.customRouter && this.customRouter.custom) {
        const customRouterResult = this.customRouter.custom(data);
        Object.keys(customRouterResult)
            .forEach(path => {
                const file = customRouterResult[path].target;
                const mapping = this.fileInputIndex[file];
                if (!mapping) {
                    throw new Error(`The file ${file} couldn't be found. And it's required by custom route ${path} as target.`);
                }
                result[path] = {
                    in: mapping.in,
                    process: mapping.process,
                    params: customRouterResult[path].params || {}
                };
            });
    }

    return result;
}

Runner.prototype.routes = function() {
    return Object.keys(this.router());
}

Runner.prototype.route = function(route) {
    return this.router()[route];
}

Runner.prototype.routeExists = function(route) {
    return !!this.router()[route];
}

module.exports = { Runner };
