const {resolve} = require('path');
const fs = require('fs');

const MANIFEST_PATH = resolve(__dirname, '../../.cache-manifest');

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8') || '{}');

module.exports = file => {
	if (process.env.ELEVENTY_ENV === 'dev') {
		return file;
	}

	const manifestKey = file.replace(/^\//, '');

	return manifestKey in manifest ? manifest[manifestKey] : manifestKey
};
