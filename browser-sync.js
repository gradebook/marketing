if (!process.env.LIVE_RELOAD_PORT) {
	require('dotenv').config();
}

module.exports = {
	server: {
		baseDir: './dist/'
	},
	watch: false,
	open: false,
	notify: false,
	ui: false,
	port: Number(process.env.LIVE_RELOAD_PORT)
};
