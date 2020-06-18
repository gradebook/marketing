const chalk = require('chalk');
const manifest = require('../../tasks/get-cache');

module.exports = file => {
	if (process.env.NO_CACHEBUST === 'true') {
		return `/built/${file}`;
	}

	const manifestKey = file.replace(/^\//, '');
	const hashedItem = manifest.getItem(manifestKey);

	if (hashedItem) {
		return `/built/${hashedItem}`;
	}

	console.error(chalk.red('Asset "%s" does not exist'), manifestKey);
};
