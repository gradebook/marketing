const manifest = require('../../get-cache');

module.exports = file => {
	if (!manifest || process.env.NO_CACHEBUST === 'true') {
		return file.replace('scss', 'css');
	}

	const manifestKey = file.replace(/^\//, '');
	const prefix = file.startsWith('/') ? '/' : ''

	return manifestKey in manifest ? prefix + manifest[manifestKey] : prefix + manifestKey.replace('scss', 'css')
};
