// @ts-check
require('dotenv').config();
const {Transform} = require('stream');
const {join} = require('path');
const {task, src, dest, parallel, series, watch} = require('gulp');
const FileHasher = require('./tasks/file-hasher');
let eleventy;

const BLACKLISTED_CSS_FILES = ['vars.css', 'normalize.css'];
const hasher = new FileHasher();

const transformCssFileNames = new Transform({
	objectMode: true,
	transform: function transformCssFileNames(file, enc, cb) {
		const finalFileName = file.relative.split('/').pop();
		if (!BLACKLISTED_CSS_FILES.includes(finalFileName)) {
			file.path = join(file.base, finalFileName);
			this.push(file);
		}

		cb();
	}
});

task('clean', () => {
	/** @type {(glob: string) => Promise<void>} */
	const rimraf = require('util').promisify(require('rimraf'));
	const globs = ['dist', '.cachebust-manifest', 'static/css', 'static/js'];

	return Promise.all(globs.map(glob => rimraf(glob)));
});

task('enableProdMode', () => {
	process.env.NODE_ENV = 'production';
	return Promise.resolve();
});

task('js', () => new Promise((resolve, reject) => {
	const {spawn} = require('child_process');

	const cp = spawn('yarn', ['rollup', '-c'], {stdio: 'inherit'});

	cp.on('exit', code => {
		code === 0 ? resolve(code) : reject(code);
	});
}));

task('css', (cb) => {
	const postcss = require('gulp-postcss');

	return src('./styles/*/*.css')
		.pipe(postcss([
			require('postcss-easy-import'),
			require('autoprefixer'),
			require('postcss-custom-properties'),
			require('postcss-color-function')({
				preserveCustomProps: false
			}),
			... process.env.NODE_ENV === 'production' ? [require('cssnano')] : []
		]))
		.pipe(transformCssFileNames)
		.pipe(hasher.transform)
		.pipe(dest('dist/built'))
		.on('end', () => {
			if (process.env.NO_CACHEBUST === 'true') {
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
	return src('./dist/*.html')
		.pipe(minify)
		.pipe(dest('./dist'));
});

task('default', series(parallel(['css', 'js']), 'html'));

task('dev', series('default', function devServer() {
	const liveReload = require('browser-sync');
	const reload = () => liveReload.reload();
	watch('./src/**/*.css', series('css')).on('change', reload);
	watch('./src/**/*.js', series('js')).on('change', reload);
	watch('./src/**/*.hbs', series('html')).on('change', reload);

	liveReload.init({
		server: {
			baseDir: './dist/'
		},
		watch: false,
		open: false,
		notify: false
	})
}));

task('build', series(
	'enableProdMode',
	'default',
	'html:minify'
));
