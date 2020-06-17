const manifest = require('../../tasks/get-cache');

module.exports = file => {
	if (process.env.NO_CACHEBUST === 'true') {
		return file;
	}

	const manifestKey = file.replace(/^\//, '');
	const prefix = file.startsWith('/') ? '/' : ''
	return prefix + manifest.getItem(manifestKey)
};
