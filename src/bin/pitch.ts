#!/usr/bin/env node
import * as cli from '../pitch/cli/cli';
import { IApp } from '../pitch/cli/models';
import { printHelp } from '../pitch/cli/print';
import * as pitch from '../pitch/index';

const app: IApp = {
	name: 'pitch',
	version: pitch.version,
	commands: {
		build: {
			description: 'Builds the static page and outputs to dist folder.',
			flags: {
				debug: { description: 'Will track important events in the build process and display a summary at the end.' },
			},
			action: (options) => {
				pitch.build(options);
			},
		},
		serve: {
			description: 'Serves the static page for development with live transpilation.',
			flags: {
				host: { description: 'Sets the host to use with the http server.', default: 'localhost' },
				port: { description: 'Sets the port to use with the http server.', default: '3000' },
			},
			action: (options) => {
				pitch.serve(options);
			},
		},
		version: {
			description: 'Displays the version.',
			action: () => {
				console.log(pitch.version);
			},
		},
		help: {
			description: 'Shows this helpful output.',
			action: () => {
				printHelp(app);
			},
		},
	},
};

cli.run(app);
