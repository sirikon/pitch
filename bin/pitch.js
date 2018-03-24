#!/usr/bin/env node
var program = require('commander');
const pitch = require('../index');

program
    .version('0.0.1')
    .option('build', 'Builds the static page and outputs to dist folder.')
    .parse(process.argv);

if (program.build) {
    pitch.build();
} else {
    pitch.serve();
}
