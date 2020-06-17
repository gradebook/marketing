const revHash = require('rev-hash');
const fs = require('fs');
const manifest = require('./tasks/get-cache').js;

module.exports = {
	renderChunk(code, chunk) {
		const hash = revHash(code);
		const {fileName} = chunk;
		const newFile = fileName.replace('.js', `-${hash}.js`);
		manifest[fileName] = newFile;

		chunk.fileName = newFile;
	},

	onWriteBundle() {
		return fs.promises.writeFile('js.cache-manifest', JSON.stringify(manifest, null, 2));
	}
};
