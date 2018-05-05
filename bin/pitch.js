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
    .option('--host <host>', 'Sets the host to use with the http server', program.STRING, 'localhost')
    .option('--port <port>', 'Sets the port to use with the http server', program.INT, 3000)
    .action((args, options) => {
        pitch.serve(options);
    });

program.parse(process.argv);
