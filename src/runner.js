function Runner(processors) {
    this.processors = processors || [];
    this.fileInputIndex = {};
    this.fileOutputIndex = {};
}

function validateFiles(files) {
    if (files === null || files === undefined) throw new Error("No file list provided");
}

function setFileExtension(file, extension) {
    var lastDot = file.lastIndexOf('.');
    return file.substr(0, lastDot) + '.' + extension;
}

Runner.prototype.in = function(files) {
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
        delete this.fileInputIndex[mapping.in];
        delete this.fileOutputIndex[mapping.out];
    });
}

module.exports = { Runner };
