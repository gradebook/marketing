// @ts-check
require('dotenv').config();
const {task, src, dest, parallel, series, watch} = require('gulp');
const {GulpCssCompilerBackend} = require('./compiler-backend/gulp-css.js');
const {JSCompilerBackend} = require('./compiler-backend/js.js');
/** @type {import('@11ty/eleventy/src/Eleventy.js')} */
let _eleventy;

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

async function createEleventyBackend() {
	if (_eleventy) {
		await _eleventy.restart();
	} else {
		const Eleventy = require('@11ty/eleventy');
		// @ts-expect-error only the config is publicly exported
		_eleventy = new Eleventy('./src', './dist');
	}

	await _eleventy.init();
	return _eleventy;
}

/** @param {Function | string | null} [fileOrCallback] */
async function triggerEleventyBuild(fileOrCallback = null) {
	const eleventy = await createEleventyBackend();

	if (fileOrCallback && typeof fileOrCallback !== 'function') {
		// @ts-expect-error we need to trigger `eleventy.resourceModified` on their event bus, and the only way to do that
		// is to call this private function
		_eleventy._addFileToWatchQueue(fileOrCallback);
	}

	await eleventy.write();

	if (typeof fileOrCallback === 'function') {
		fileOrCallback();
	}
}

task('clean', () => {
	const rimraf = require('rimraf');
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
task('html', triggerEleventyBuild);

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
	watch(['./src/**/*.hbs','./src/**/*.md']).on('change', async file => {
		await triggerEleventyBuild(file);
		reload();
	});
}));

task('build', series(
	'enableProdMode',
	'default',
	'html:minify'
));
