const fs = require('fs');
const path = require('path');
const differ = require('diff');
const dirCompare = require('dir-compare');
const { spawnSync } = require('child_process');

const currentDirectory = __dirname;
const pitchBinaryPath = path.join(currentDirectory, '../bin/pitch.js');

function getFolders() {
    return fs.readdirSync(currentDirectory)
        .map((name) => path.join(currentDirectory, name))
        .filter((fullPath) => fs.lstatSync(fullPath).isDirectory());
}

function runPitch(folder) {
    const result = spawnSync('node', [pitchBinaryPath, 'build'], { cwd: folder });
    const failed = result.status !== 0 || !!result.error;
    console.log(` - Pitch execution [${failed ? 'ERROR' : 'OK'}]`);
    if (failed) {
        console.log(result.stdout.toString('utf8'));
        console.log(result.stderr.toString('utf8'));
        process.exit(1);
    }
}

function compareResults(folder) {
    const dist = path.join(folder, 'dist');
    const expectedDist = path.join(folder, 'expected-dist');
    const result = dirCompare.compareSync(dist, expectedDist, { compareContent: true });
    const failed = result.distinct > 0;
    console.log(` - Result comparison [${failed ? 'ERROR' : 'OK'}]`);
    if (failed) {
        result.diffSet
            .filter((fileDiff) => fileDiff.state === 'distinct')
            .forEach((fileDiff) => {
                const aFullPath = path.join(fileDiff.path1, fileDiff.name1);
                const bFullPath = path.join(fileDiff.path2, fileDiff.name2);
                const aContent = fs.readFileSync(aFullPath, { encoding: 'utf8' });
                const bContent = fs.readFileSync(bFullPath, { encoding: 'utf8' });
                const contentDiff = differ.diffLines(aContent, bContent);
                console.log("");
                console.log(aFullPath);
                console.log(bFullPath);
                console.log("");

                let line = 0;
                contentDiff.forEach((block) => {
                    line += block.count;
                    if (block.added || block.removed) {
                        const arrows = block.added ? '>>>' : '<<<';
                        console.log(`${line} ${arrows} ${block.value.replace(/\n/g, '')}`);
                    }
                });
            });
        process.exit(1);
    }
}

getFolders()
    .forEach((folderPath) => {
        console.log(path.basename(folderPath));
        runPitch(folderPath);
        compareResults(folderPath);
    });
