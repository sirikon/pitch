import * as path from 'path';

import { init } from './data';
import { IInput, IProcessor } from './models';
const data = init('./data');

function validateFiles(files: any) {
	if (files === null || files === undefined) { throw new Error('No file list provided'); }
}

function setFileExtension(file: any, extension: any) {
	const lastDot = file.lastIndexOf('.');
	return file.substr(0, lastDot) + '.' + extension;
}

export class Runner {
	private readyPromise: Promise<any>;
	private readyPromiseResolver: () => void;
	private processorsIndex: { [processorName: string]: IProcessor } = {};
	private fileInputIndex: { [key: string]: any } = {};

	constructor(
		private input: IInput,
		private processors: IProcessor[] = [],
		private customRouterProvider: () => any = (() => null)) {
			this.generateProcessorsIndex();
			this.setupReadyPromise();
			this.bindEvents();

			this.input.run();
		}

	public isReady() {
		return this.readyPromise;
	}

	public getRoutes() {
		return Object.keys(this.router());
	}

	public process(route: any): any {
		const mapping = this.route(route);
		const file = this.input.read(mapping.in);
		const processor = this.processorsIndex[mapping.process];
		if (!processor) { return file.readStream; }
		return processor.process({
			absolutePath: file.absolutePath,
			params: mapping.params,
			data,
		});
	}

	public stop() {
		this.input.stop();
	}

	private generateProcessorsIndex() {
		this.processors.forEach((processor) => {
			this.processorsIndex[processor.name] = processor;
		});
	}

	private setupReadyPromise() {
		this.readyPromise = new Promise((resolve) => {
			this.readyPromiseResolver = resolve;
		});
	}

	private bindEvents() {
		this.input.events.on('add', this.add.bind(this));
		this.input.events.on('remove', this.remove.bind(this));
		this.input.events.on('ready', () => {
			this.readyPromiseResolver();
		});
	}

	private add(files: any) {
		validateFiles(files);
		files.forEach((file: any) => {
			const mapping: any = {
				in: file,
				process: null,
			};

			let i = 0;
			let found = false;
			while (i < this.processors.length && !found) {
				const processor = this.processors[i];
				if (processor.test(file)) {
					mapping.process = processor.name;
					found = true;
				}
				i++;
			}

			this.fileInputIndex[mapping.in] = mapping;
		});
	}

	private remove(files: any) {
		validateFiles(files);
		files.forEach((file: any) => {
			delete this.fileInputIndex[file];
		});
	}

	private isAutoRoutingEnabled(): boolean {
		const customRouter = this.customRouterProvider();
		if (!customRouter) { return true; }
		if (customRouter.auto === false) { return false; }
		return true;
	}

	private getAutoRouterExcludedPath() {
		const customRouter = this.customRouterProvider();
		if (customRouter && customRouter.auto) {
			let excludedPath = customRouter.auto.exclude;
			if (excludedPath[excludedPath.length - 1] !== path.sep) {
				excludedPath += path.sep;
			}
			return customRouter.auto.exclude;
		}
		return null;
	}

	private router() {
		const customRouter = this.customRouterProvider();
		const result: any = {};

		if (this.isAutoRoutingEnabled()) {
			Object.keys(this.fileInputIndex)
				.forEach((file: any) => {
					if (file.startsWith(this.getAutoRouterExcludedPath())) {
						return;
					}
					const mapping = this.fileInputIndex[file];
					const processor = this.processorsIndex[mapping.process];
					const p = processor ? setFileExtension(file, processor.outputExtension) : file;
					result[p] = mapping;
				});
		}

		if (customRouter && customRouter.custom) {
			const customRouterResult = customRouter.custom(data);
			Object.keys(customRouterResult)
				.forEach((routePath: any) => {
					const normalizedRoutePath = path.normalize(routePath);
					const file = path.normalize(customRouterResult[routePath].target);
					const mapping = this.fileInputIndex[file];
					if (!mapping) {
						throw new Error(`The file ${file} couldn't be found. And it's required by custom route ${routePath} as target.`);
					}
					result[normalizedRoutePath] = {
						in: mapping.in,
						process: mapping.process,
						params: customRouterResult[routePath].params || {},
					};
				});
		}

		return result;
	}

	private route(route: string) {
		return this.router()[route];
	}

	private routeExists(route: any) {
		return !!this.route(route);
	}
}
