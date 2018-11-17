#!/usr/bin/env node
const cli = require('../src/cli');
const pitch = require('../index');

const app = {
    name: 'pitch',
    version: pitch.version,
    commands: {
        build: {
            description: 'Builds the static page and outputs to dist folder.',
            action: () => {
                pitch.build();
            }
        },
        serve: {
            description: 'Serves the static page for development with live transpilation.',
            flags: {
                host: { description: 'Sets the host to use with the http server.', default: 'localhost' },
                port: { description: 'Sets the port to use with the http server.', default: '3000' },
            },
            action: (options) => {
                pitch.serve(options);
            }
        },
        version: {
            description: 'Displays the version.',
            action: () => {
                console.log(pitch.version);
            }
        },
        help: {
            description: 'Shows this helpful output.'
        }
    }
};

cli.run(app);
