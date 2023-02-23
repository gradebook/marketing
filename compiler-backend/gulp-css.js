
// @ts-check
const {Transform} = require('stream');
const {join, sep} = require('path');
const {dest, src} = require('gulp');
const {addHandler} = require('./_helper.js');

/** @typedef {import('./abstract.js').CompilerBackend} CompilerBackend */
/** @typedef {import('./abstract.js').CompilerBackendOptions} CompilerBackendOptions */

/** @implements {CompilerBackend} */
module.exports.GulpCssCompilerBackend = class GulpCssCompilerBackend {
	#watch;
	#cachebust;
	/** @type {Array<(error?: unknown) => any>} */
	#handlers;
	/** @type {import('../tasks/get-cache.js')} */
	#manifest;
	/** @type {Promise<void> | undefined} */
	#whenReady;
	/** @type {NodeJS.ReadWriteStream | null} */
	#pipeline;

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

		this.runOnce();
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

	#getPostCssTransformer() {
		const postcss = require('gulp-postcss');
		return postcss([
			require('postcss-easy-import'),
			require('autoprefixer'),
			require('postcss-custom-properties'),
			require('postcss-extend-rule')({name: 'apply', onUnusedExtend: 'throw'}),
			... process.env.NODE_ENV === 'production' ? [require('cssnano')] : []
		]);
	}

	#getFileNameTransformer() {
		const IGNORED_CSS_FILES = ['vars.css', 'normalize.css'];
		return new Transform({
			objectMode: true,
			transform: function transformCssFileNames(file, enc, cb) {
				const finalFileName = file.relative.split(sep).pop();
				if (!IGNORED_CSS_FILES.includes(finalFileName)) {
					file.path = join(file.base, finalFileName);
					this.push(file);
				}

				cb();
			}
		});
	}

	#getFileHasher() {
		const FileHasher = require('../tasks/file-hasher')
		return new FileHasher();
	}

	#createPipeline() {
		this.#pipeline = src('./styles/*/*.css')
			.pipe(this.#getPostCssTransformer())
			.pipe(this.#getFileNameTransformer())
			.pipe(this.#getFileHasher().transform)
			.pipe(dest('dist/built'))
			.on('end', () => {
				if (this.#cachebust) {
					this.#manifest.write()
						.then(() => this.#emit())
						.catch(error => this.#emit(error));
				} else {
					this.#emit();
				}
			});

		return this.#pipeline;
	}

	runOnce() {
		if (this.#pipeline) {
			return this.#pipeline;
		}

		return this.#createPipeline();
	}

	/** @param {unknown} [error] */
	#emit(error) {
		this.#pipeline = null;
		for (const handler of this.#handlers) {
			handler(error);
		}
	}
}
