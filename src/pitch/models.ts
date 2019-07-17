import { EventEmitter } from 'events';
import { ReadStream } from 'fs';
import { Readable } from 'stream';

export interface IProcessContext {
	absolutePath: string;
	params: any;
	data: any;
}

export interface IProcessor {
	name: string;
	outputExtension: string;
	test(file: string): boolean;
	process(context: IProcessContext): Readable;
}

export interface IInputFile {
	absolutePath: string;
	readStream: ReadStream;
}

export interface IInput {
	events: EventEmitter;
	run(): void;
	stop(): void;
	read(path: string): IInputFile;
}
