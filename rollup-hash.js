const revHash = require('rev-hash');
const manifest = require('./tasks/get-cache');

module.exports = {
	renderChunk(code, chunk) {
		const hash = revHash(code);
		const {fileName} = chunk;
		const newFile = fileName.replace('.js', `-${hash}.js`);
		manifest.setItem(fileName, newFile);

		chunk.fileName = newFile;
	}
};
