module.exports = function (options) {
	const {pagination, page} = this;
	if (!pagination.previousPageHref && !pagination.nextPageHref) {
		return options.inverse(this);
	}

	const previous = (page.permalink === pagination.previousPageHref) ? null : pagination.previousPageHref;
	const next = (page.permalink === pagination.nextPageHref) ? null : pagination.nextPageHref;

	return options.fn({previous, next});
};
