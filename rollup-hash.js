const revHash = require('rev-hash');
const manifest = require('./tasks/get-cache');

module.exports = {
	renderChunk(code, chunk) {
		chunk.fileName = manifest.transform(chunk.fileName, code);
	}
};
