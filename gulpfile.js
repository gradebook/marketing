// @ts-check
require('dotenv').config();
const {task, src, dest, parallel, series, watch} = require('gulp');
const {GulpCssCompilerBackend} = require('./compiler-backend/gulp-css.js');
const {JSCompilerBackend} = require('./compiler-backend/js.js');
let eleventy;

/** @type {JSCompilerBackend} */
let jsCompilerBackend;
/** @type {GulpCssCompilerBackend} */
let gulpCssCompilerBackend;

function createJsBackend() {
	if (!jsCompilerBackend) {
		jsCompilerBackend = new JSCompilerBackend({
			watch: process.env.WATCH === 'true',
			cachebust: process.env.NO_CACHEBUST !== 'true',
		});
	}

	return jsCompilerBackend.initAsync();
}

function createCssBackend() {
	if (!gulpCssCompilerBackend) {
		gulpCssCompilerBackend = new GulpCssCompilerBackend({
			watch: process.env.WATCH === 'true',
			cachebust: process.env.NO_CACHEBUST !== 'true',
		});
	}

	return gulpCssCompilerBackend.initAsync();
}

task('clean', () => {
	/** @type {(glob: string) => Promise<void>} */
	const rimraf = require('util').promisify(require('rimraf'));
	const globs = ['dist', '.cachebust-manifest'];

	return Promise.all(globs.map(glob => rimraf(glob)));
});

task('enableProdMode', () => {
	process.env.NODE_ENV = 'production';
	return Promise.resolve();
});

task('enableWatchMode', () => {
	process.env.WATCH = 'true';
	process.env.NO_CACHEBUST = 'true';
	return Promise.resolve();
});

task('js', createJsBackend);

task('css', createCssBackend);

task('html', async () => {
	if (!eleventy) {
		const Eleventy = require('@11ty/eleventy');
		eleventy = new Eleventy('./src', './dist');
		await eleventy.init();
	}

	await eleventy.write();
	eleventy.writer.writeCount = 0;
});

task('html:minify', () => {
	const minify = require('./tasks/minify-html');
	return src('./dist/**/*.html')
		.pipe(minify)
		.pipe(dest('./dist'));
});

task('default', series(parallel(['css', 'js']), 'html'));

task('dev', series('enableWatchMode', 'default', function devServer() {
	const server = require('./browser-sync.js').createEleventyDevServer();
	const reload = () => server.reload({});
	jsCompilerBackend.subscribe(reload);
	gulpCssCompilerBackend.subscribe(reload)
	watch('./styles/**/*').on('change', () => gulpCssCompilerBackend.runOnce());
	watch(['./src/**/*.hbs','./src/**/*.md'], series('html')).on('change', reload);
}));

task('build', series(
	'enableProdMode',
	'default',
	'html:minify'
));
