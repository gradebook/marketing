const {performance} = require('perf_hooks')

module.exports = function wrapFunction(fn, context, logStart = true) {
	return async function time(...args) {
		if (logStart) {
			console.log('Starting %s', context);
		}

		const start = performance.now();

		try {
			return await fn(...args);
		} finally {
			const end = performance.now();
			const timeTaken = end - start;
			console.log('%s finished in %sms', context, timeTaken.toFixed(3));
		}
	};
};
