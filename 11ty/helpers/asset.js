const manifest = require('../../get-cache').all;

module.exports = file => {
	if (!manifest || process.env.NO_CACHEBUST === 'true') {
		return file;
	}

	const manifestKey = file.replace(/^\//, '');
	const prefix = file.startsWith('/') ? '/' : ''

	return manifestKey in manifest ? prefix + manifest[manifestKey] : prefix + manifestKey
};
