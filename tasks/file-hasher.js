// @ts-check
const {Transform, PassThrough} = require('stream');
const {join, resolve} = require('path');
const fs = require('fs');
module.exports = class FileHasher {
	constructor() {
		if (process.env.NO_CACHEBUST === 'true') {
			this.transform = new PassThrough({
				objectMode: true
			});
		} else {
			this._shouldWrite = true;
			this.transform = new Transform({
				objectMode: true,
				transform: (file, enc, cb) => this._transform(file, null, cb)
			});
		}
	}

	/**
	 * @param {import('vinyl').BufferFile} file
	 * @param {void} enc
	 * @param {() => void} cb
	 */
	_transform(file, enc, cb) {
		const revHash = require('rev-hash');
		const manifest = require('./get-cache');

		/** @type string */
		const originalFileName = file.relative;
		const fileHash = revHash(file.contents);

		const lastPeriod = originalFileName.lastIndexOf('.');
		const finalFileName = originalFileName.slice(0, lastPeriod) + '-' + fileHash + originalFileName.slice(lastPeriod);

		const outputPath = join('built', finalFileName);
		manifest.setItem(originalFileName, outputPath);

		file.path = join(file.base, finalFileName);
		this.transform.push(file);
		cb();
	}

	async write() {
		if (this._shouldWrite) {
			const manifest = require('./get-cache');
			return manifest.write();
		}
	}
}
