import * as sass from 'dart-sass';
import { Readable } from 'stream';
import { IProcessor } from '../models';
import * as print from '../print';

const eolName = process.platform === 'win32' ? 'crlf' : 'lf';

export const sassProcessor: IProcessor = {
	name: 'sass',
	outputExtension: 'css',
	test(file) {
		return file.substr(-5) === '.scss';
	},
	process({ absolutePath }) {
		const stream = new Readable();
		stream._read = () => { /**/ };

		sass.render({
			file: absolutePath,
			linefeed: eolName,
		}, (err: any, result: any) => {
			if (err) {
				print.error(err.formatted);
				stream.emit('error', err);
				return;
			}
			stream.push(result.css);
			stream.push(null);
		});

		return stream;
	},
};
