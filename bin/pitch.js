#!/usr/bin/env node
var program = require('caporal');
const pitch = require('../index');

program
    .name('pitch')
    .version(pitch.version)

    .command('build')
    .description('Builds the static page and outputs to dist folder.')
    .action(() => {
        pitch.build();
    })

    .command('serve')
    .description('Serves the static page for development with live transpilation.')
    .action(() => {
        pitch.serve();
    });

program.parse(process.argv);
