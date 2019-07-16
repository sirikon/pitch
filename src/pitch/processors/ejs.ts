import * as ejs from 'ejs';
import { Readable } from 'stream';
import { IProcessor } from '../models';
import * as print from '../print';

export const ejsProcessor: IProcessor = {
	name: 'ejs',
	outputExtension: 'html',
	test(file) {
		return file.substr(-4) === '.ejs';
	},
	process({ absolutePath, data, params }) {
		const stream = new Readable();
		stream._read = () => { /**/ };

		ejs.renderFile(absolutePath, { data, params }, (err, result) => {
			if (err) {
				print.error(err.stack);
				stream.emit('error', err);
				return;
			}
			stream.push(result);
			stream.push(null);
		});

		return stream;
	},
};
