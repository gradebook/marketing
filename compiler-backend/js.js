// @ts-check
const {spawn, ChildProcess} = require('child_process');
const {addHandler} = require('./_helper.js');

/**
 * @typedef {import('./abstract.js').CompilerBackend} CompilerBackend
 * @typedef {import('./abstract.js').CompilerBackendOptions} CompilerBackendOptions
 */

/** @implements {CompilerBackend} */
module.exports.JSCompilerBackend = class JSCompilerBackend {
	#watch;
	#cachebust;
	/** @type {Array<(error?: unknown) => any>} */
	#handlers;
	/** @type {import('../tasks/get-cache.js')} */
	#manifest;
	/** @type {Promise<void> | undefined} */
	#whenReady;

	/** @param {CompilerBackendOptions} options */
	constructor({watch, cachebust}) {
		this.#watch = watch;
		this.#cachebust = cachebust;
		this.#handlers = [];
	}

	init() {
		// Ensure idempotency
		if (!this.#whenReady) {
			this.initAsync();
			return;
		}

		if (this.#cachebust) {
			this.#manifest = require('../tasks/get-cache.js');
		}

		const childProcess = spawn('node', this.#getRollupExec(), {
			stdio: ['inherit', 'inherit', 'inherit', 'ipc']
		});

		if (this.#watch) {
			this.#configureWatchedProcess(childProcess);
		} else {
			this.#configureOneOffProcess(childProcess);
		}
	}

	initAsync() {
		// Idempotency check
		if (this.#whenReady) {
			return this.#whenReady;
		}

		this.#whenReady = new Promise((resolve, reject) => {
			this.subscribe((error) => {
				if (error) {
					reject(error);
				} else {
					resolve();
				}
			}, true);
		});

		this.init();

		return this.#whenReady;
	}

	/**
	 * @param {(error?: unknown) => any} handler
	 * @param {boolean} [once]
	 */
	subscribe(handler, once) {
		addHandler(this.#handlers, handler, once);
	}

	#getRollupExec() {
		// NOTE: we can't use yarn here because we need ipc
		const rollupPath = require.resolve('rollup/dist/bin/rollup');
		const response = [rollupPath, '-c'];

		if (this.#watch) {
			response.push('-w');
		}

		return response;
	}

	/** @param {ChildProcess} childProcess */
	#configureWatchedProcess(childProcess) {
		process.on('exit', () => {
			childProcess.kill('SIGTERM');
		});

		childProcess.on('message', message => {
			console.log('GOT MESSAGE', message);
			// @ts-ignore
			if (message.bundleWritten === true) {
				this.#emit();
			}
		});
	}

	/** @param {ChildProcess} childProcess */
	#configureOneOffProcess(childProcess) {
		childProcess.on('message', message => {
			if (this.#cachebust) {
				// @ts-ignore
				for (const key in message) {
					this.#manifest.store(key, message[key]);
				}
			}
		});

		childProcess.on('exit', code => {
			if (code === 0) {
				if (this.#manifest) {
					this.#manifest
						.write()
						.then(() => this.#emit())
						.catch(error => this.#emit(error));
				} else {
					this.#emit();
				}
			} else {
				this.#emit(code);
			}
		});
	}

	/** @param {unknown} [error] */
	#emit(error) {
		for (const handler of this.#handlers) {
			handler(error);
		}
	}
}
