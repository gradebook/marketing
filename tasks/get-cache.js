const fs = require('fs');
const {resolve, basename, dirname, join} = require('path')

const cacheManifestLocation = resolve(__dirname, '../.cachebust-manifest');
let cache = {};

try {
	cache = JSON.parse(fs.readFileSync(cacheManifestLocation, 'utf8') || '{}');
} catch {}

module.exports = {
	getItem(item) {
		if (Reflect.has(cache, item)) {
			return cache[item];
		}

		return null;
	},
	store(key, value) {
		cache[key] = value
	},
	transform(fullFilePath, fileContents) {
		const hash = require('rev-hash');
		const fileName = basename(fullFilePath);
		const contentHash = hash(fileContents);
		const hashedFileName = fileName.replace(
			/\.([a-z]+)$/i,
			(_, extension) => `-${contentHash}.${extension}`
		)

		cache[fileName] = hashedFileName;
		return join(dirname(fullFilePath), hashedFileName);
	},
	write() {
		if (process.send) {
			process.send(cache);
			return Promise.resolve();
		}

		return fs.promises.writeFile(cacheManifestLocation, JSON.stringify({...cache}, null, 2));
	}
};
