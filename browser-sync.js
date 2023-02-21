require('dotenv/config');
const preview = require('./11ty/preview');

module.exports.config = {
	port: Number(process.env.LIVE_RELOAD_PORT),
	middleware: [preview.middleware.bind(preview)],
	showAllHosts: true,
	portReassignmentRetryCount: 0,
	watch: []
};

module.exports.createEleventyDevServer = function () {
	const EleventyDevServer = require('@11ty/eleventy-dev-server');
	const serverManger = new EleventyDevServer('gb.dev.server', './dist/', module.exports.config);
	serverManger.server.listen(module.exports.config.port);
	return serverManger;
}
