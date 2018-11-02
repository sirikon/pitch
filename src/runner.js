const { data } = require('./data');

function validateFiles(files) {
    if (files === null || files === undefined) throw new Error("No file list provided");
}

function setFileExtension(file, extension) {
    var lastDot = file.lastIndexOf('.');
    return file.substr(0, lastDot) + '.' + extension;
}

function Runner(input, processors) {
    this.input = input;
    this.processors = processors || [];

    this.readyPromise = null;
    this.readyPromiseResolver = null;
    this.processorsIndex = {};
    this.fileInputIndex = {};
    this.fileOutputIndex = {};

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
            out: file,
            process: null
        };

        var i = 0;
        var found = false;
        while(i < this.processors.length && !found) {
            var processor = this.processors[i];
            if (processor.test(file)) {
                mapping.out = setFileExtension(file, processor.outputExtension);
                mapping.process = processor.name;
                found = true;
            }
            i++;
        }

        this.fileInputIndex[mapping.in] = mapping;
        this.fileOutputIndex[mapping.out] = mapping;
    });
}

Runner.prototype.remove = function(files) {
    validateFiles(files);
    files.forEach((file) => {
        var mapping = this.fileInputIndex[file];
        if (this.fileOutputIndex[mapping.out].in === mapping.in) {
            delete this.fileOutputIndex[mapping.out];
        }
        delete this.fileInputIndex[mapping.in];
    });
}

Runner.prototype.process = function(file) {
    var mapping = this.fileOutputIndex[file];
    var file = this.input.read(mapping.in);
    file.data = data;
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

Runner.prototype.routes = function() {
    return Object.keys(this.fileOutputIndex);
}

Runner.prototype.routeExists = function(route) {
    return !!this.fileOutputIndex[route];
}

module.exports = { Runner };
