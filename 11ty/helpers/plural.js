module.exports = (count, {hash}) => {
	if (count === 0) {
		return hash.empty.replace('%', count);
	}

	if (count === 1) {
		return hash.singular.replace('%', count);
	}

	return hash.plural.replace('%', count);
};
