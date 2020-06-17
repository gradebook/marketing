// @ts-check
const {Transform, PassThrough} = require('stream');
const {join, relative, resolve} = require('path');
const fs = require('fs');
module.exports = class FileHasher {
	constructor() {
		this._mapList = {};
		if (process.env.NO_CACHEBUST === 'true') {
			this.transform = new PassThrough({
				objectMode: true
			});
		} else {
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

		const fileHash = revHash(file.contents);
		/** @type string */
		const originalFileName = file.relative;
		const lastPeriod = originalFileName.lastIndexOf('.');
		const finalFileName = originalFileName.slice(0, lastPeriod) + '-' + fileHash + originalFileName.slice(lastPeriod);
		const outputPath = join('static', relative(file.cwd, file.base), finalFileName).replace('styles', 'css');
		console.log({outputPath, finalFileName, originalFileName})
		this._mapList[originalFileName] = outputPath;
		this._mapList[outputPath.replace(finalFileName, originalFileName)] = outputPath;

		file.path = join(file.base, finalFileName);
		this.transform.push(file);
		cb();
	}

	write() {
		return fs.promises.writeFile(resolve(__dirname, '../css.cache-manifest'), JSON.stringify(this._mapList, null, 2));
	}
}
