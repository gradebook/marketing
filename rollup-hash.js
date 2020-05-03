const revHash = require('rev-hash');
const fs = require('fs');
const manifest = require('./get-cache') || {};

const transform = (fileName, hash) => {
	const newFile = fileName.replace('.js', `-${hash}.js`);
	manifest[fileName] = newFile;
	return newFile;
};

module.exports = {
	renderChunk(code, chunk, options) {
		const chunkHash = revHash(code);

		if (options.file.endsWith(chunk.fileName)) {
			options.file = transform(options.file, chunkHash);
		}

		chunk.fileName = transform(chunk.fileName, chunkHash);
	},

	writeBundle() {
		return fs.promises.writeFile('.cache-manifest', JSON.stringify(manifest, null, 2));
	}
}
