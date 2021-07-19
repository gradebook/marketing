const preview = require('./11ty/preview');

if (!process.env.LIVE_RELOAD_PORT) {
	require('dotenv').config();
}

/**
 * @type {import('browser-sync').Options}
 */
module.exports = {
	server: {
		baseDir: './dist/',
		middleware: [{
			route: preview.ROUTE_MATCHER,
			handle: preview.middleware.bind(preview)
		}]
	},
	watch: false,
	open: false,
	notify: false,
	ui: false,
	port: Number(process.env.LIVE_RELOAD_PORT)
};
