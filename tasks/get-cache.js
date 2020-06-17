const fs = require('fs');
const {resolve} = require('path')

const cacheManifestLocation = resolve(__dirname, '../.cachebust-manifest');
let cache = {};

try {
	cache = JSON.parse(fs.readFileSync(cacheManifestLocation, 'utf8') || '{}')
} catch {}

module.exports = {
	getItem(item) {
		if (Reflect.has(cache, item)) {
			return cache[item];
		}

		return item;
	},
	setItem(item, hashedFile) {
		cache[item] = hashedFile;
	},
	write() {
		return fs.promises.writeFile(cacheManifestLocation, JSON.stringify(cache, null, 2));
	}
};
