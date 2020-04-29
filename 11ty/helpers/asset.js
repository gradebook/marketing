const {resolve} = require('path');
const fs = require('fs');

const MANIFEST_PATH = resolve(__dirname, '../../.cache-manifest');

let manifest;

try {
	manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
} catch {}

module.exports = file => {
	if (!manifest) {
		return file.replace('scss', 'css');
	}

	const manifestKey = file.replace(/^\//, '');
	const prefix = file.startsWith('/') ? '/' : ''

	return manifestKey in manifest ? prefix + manifest[manifestKey] : prefix + manifestKey.replace('scss', 'css')
};
