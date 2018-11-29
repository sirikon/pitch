const path = require('path');

const { init } = require('./data');
const data = init('./data');

function validateFiles(files) {
    if (files === null || files === undefined) throw new Error('No file list provided');
}

function setFileExtension(file, extension) {
    var lastDot = file.lastIndexOf('.');
    return file.substr(0, lastDot) + '.' + extension;
}

function Runner(input, processors, customRouterProvider) {
    this.input = input;
    this.processors = processors || [];
    this.customRouterProvider = customRouterProvider || (() => null);

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
};

Runner.prototype.bindEvents = function() {
    this.input.events.on('add', this.add.bind(this));
    this.input.events.on('remove', this.remove.bind(this));
    this.input.events.on('ready', () => {
        this.readyPromiseResolver();
    });
};

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
};

Runner.prototype.remove = function(files) {
    validateFiles(files);
    files.forEach((file) => {
        delete this.fileInputIndex[file];
    });
};

Runner.prototype.process = function(route) {
    const mapping = this.route(route);
    const file = this.input.read(mapping.in);
    file.data = data;
    file.params = mapping.params;
    const processor = this.processorsIndex[mapping.process];
    if (processor) {
        return processor.process(file);
    } else {
        return file.readStream;
    }
};

Runner.prototype.generateProcessorsIndex = function() {
    this.processors.forEach((processor) => {
        this.processorsIndex[processor.name] = processor;
    });
};

Runner.prototype.isReady = function() {
    return this.readyPromise;
};

Runner.prototype.stop = function() {
    this.input.stop();
};

Runner.prototype.getAutoRouterExcludedPath = function() {
    const customRouter = this.customRouterProvider();

    if (customRouter && customRouter.auto) {
        let excludedPath = customRouter.auto.exclude;
        if (excludedPath[excludedPath.length - 1] != path.sep) {
            excludedPath += path.sep;
        }
        return customRouter.auto.exclude;
    }
    return null;
};

Runner.prototype.isAutoRoutingEnabled = function() {
    const customRouter = this.customRouterProvider();

    if (!customRouter) {
        return true;
    }

    if (customRouter.auto === false) {
        return false;
    }

    return true;
};

Runner.prototype.router = function() {
    const customRouter = this.customRouterProvider();
    const result = {};

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

    if (customRouter && customRouter.custom) {
        const customRouterResult = customRouter.custom(data);
        Object.keys(customRouterResult)
            .forEach(routePath => {
                const file = customRouterResult[routePath].target;
                const mapping = this.fileInputIndex[file ? path.normalize(file) : null];
                if (!mapping) {
                    throw new Error(`The file ${file} couldn't be found. And it's required by custom route ${routePath} as target.`);
                }
                result[routePath] = {
                    in: mapping.in,
                    process: mapping.process,
                    params: customRouterResult[routePath].params || {}
                };
            });
    }

    return result;
};

Runner.prototype.routes = function() {
    return Object.keys(this.router());
};

Runner.prototype.route = function(route) {
    return this.router()[route];
};

Runner.prototype.routeExists = function(route) {
    return !!this.router()[route];
};

module.exports = { Runner };
