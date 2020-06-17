const chalk = require('chalk');
const manifest = require('../../tasks/get-cache');

module.exports = file => {
	if (process.env.NO_CACHEBUST === 'true') {
		return file;
	}

	const manifestKey = file.replace(/^\//, '');
	const prefix = file.startsWith('/') ? '/' : '';

	const hashedItem = manifest.getItem(manifestKey);

	if (hashedItem) {
		return prefix + hashedItem;
	}
	console.error(chalk.red('Asset "%s" does not exist'), manifestKey);
};
