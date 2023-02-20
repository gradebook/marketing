// @ts-check
require('dotenv').config();
const {Transform} = require('stream');
const {join, sep} = require('path');
const {task, src, dest, parallel, series, watch} = require('gulp');
const {JSCompilerBackend} = require('./compiler-backend/js.js');
let eleventy;

/** @type {JSCompilerBackend} */
let jsCompilerBackend;

function createJsBackend() {
	if (!jsCompilerBackend) {
		jsCompilerBackend = new JSCompilerBackend({
			watch: process.env.WATCH === 'true',
			cachebust: process.env.NO_CACHEBUST !== 'true',
		});
	}

	return jsCompilerBackend.initAsync();
}

const IGNORED_CSS_FILES = ['vars.css', 'normalize.css'];

const transformCssFileNames = () => new Transform({
	objectMode: true,
	transform: function transformCssFileNames(file, enc, cb) {
		const finalFileName = file.relative.split(sep).pop();
		if (!IGNORED_CSS_FILES.includes(finalFileName)) {
			file.path = join(file.base, finalFileName);
			this.push(file);
		}

		cb();
	}
});

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

task('css', (cb) => {
	const FileHasher = require('./tasks/file-hasher');
	const postcss = require('gulp-postcss');
	const hasher = new FileHasher();

	return src('./styles/*/*.css')
		.pipe(postcss([
			require('postcss-easy-import'),
			require('autoprefixer'),
			require('postcss-custom-properties'),
			require('postcss-extend-rule')({name: 'apply', onUnusedExtend: 'throw'}),
			... process.env.NODE_ENV === 'production' ? [require('cssnano')] : []
		]))
		.pipe(transformCssFileNames())
		.pipe(hasher.transform)
		.pipe(dest('dist/built'))
		.on('end', () => {
			if (process.env.NO_CACHEBUST !== 'true') {
				cb();
			} else {
				const manifest = require('./tasks/get-cache');
				manifest.write().finally(cb);
			}
		});
});

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
	const liveReload = require('browser-sync');
	const reload = () => liveReload.reload();
	jsCompilerBackend.subscribe(reload);
	watch('./styles/**/*', series('css')).on('change', reload);
	watch(['./src/**/*.hbs','./src/**/*.md'], series('html')).on('change', reload);

	liveReload.init(require('./browser-sync.js'));
}));

task('build', series(
	'enableProdMode',
	'default',
	'html:minify'
));
