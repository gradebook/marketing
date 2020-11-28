const dayjs = require('dayjs');
module.exports = (dateObj, {hash: {format = 'YYYY-MM-DD'} = {}}) => {
	return dayjs(dateObj).format(format);
};
