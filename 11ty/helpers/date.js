module.exports = dateObj => {
	return new Date(dateObj).toISOString().split('T')[0];
};
