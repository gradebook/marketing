const cache = {};
const {readFileSync} = require('fs');
const {resolve} = require('path');
const {SafeString} = require('handlebars');

const root = resolve(__dirname, '../../');

function process(contents, hash = {}) {
	if (hash.class) {
		return new SafeString(contents.replace('<svg', `<svg class="${hash.class}"`));
	}

	return new SafeString(contents);
}

module.exports = function (fileName, options = {}) {
	if (!fileName.startsWith('/')) {
		console.warn('[warning] Attempted to inline a relative-path SVG; this is not allowed');
		return '';
	}

	const absolutePath = resolve(root, `.${fileName}`);

	if (Object.hasOwnProperty.call(cache, absolutePath)) {
		return process(cache[absolutePath], options.hash);
	}

	const contents = readFileSync(absolutePath, 'utf-8');
	cache[absolutePath] = contents;
	return process(contents, options.hash);
}
