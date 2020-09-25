const cache = {};
const {readFileSync} = require('fs');
const {resolve} = require('path');
const {SafeString} = require('handlebars');

const root = resolve(__dirname, '../../');

module.exports = function (fileName) {
	if (!fileName.startsWith('/')) {
		console.warn('[warning] Attempted to inline a relative-path SVG; this is not allowed');
		return '';
	}

	const absolutePath = resolve(root, `.${fileName}`);

	if (Object.hasOwnProperty.call(cache, absolutePath)) {
		return cache[absolutePath];
	}

	const contents = new SafeString(readFileSync(absolutePath, 'utf-8'));
	cache[absolutePath] = contents;
	return contents;
}
