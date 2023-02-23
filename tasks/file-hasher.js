// @ts-check
const {Transform, PassThrough} = require('stream');
const {join} = require('path');

module.exports = class FileHasher {
	/** @type {Transform} */
	transform;
	constructor() {
		if (process.env.NO_CACHEBUST === 'true') {
			this.transform = new PassThrough({
				objectMode: true
			});
		} else {
			this.transform = new Transform({
				objectMode: true,
				transform: (file, enc, cb) => this._transform(file, undefined, cb)
			});
		}
	}

	/**
	 * @param {import('vinyl').BufferFile} file
	 * @param {void} enc
	 * @param {() => void} cb
	 */
	_transform(file, enc, cb) {
		const manifest = require('./get-cache');

		file.path = join(file.base, manifest.transform(file.relative, file.contents));
		this.transform.push(file);
		cb();
	}
}
