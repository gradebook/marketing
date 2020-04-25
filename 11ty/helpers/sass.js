module.exports = file => {
	if (process.env.ELEVENTY_ENV === 'dev') {
		return file.replace('scss', 'css');
	}

	throw new Error('sass conversion in prod has not been implemented yet');
};
