function plan(files) {
    if (files === null || files === undefined) throw new Error("No file list provided");
    return files.map((file) => {
        return {
            in: file,
            out: file,
            process: null
        }
    })
}

module.exports = { plan }
