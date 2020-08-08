// @ts-check
require('dotenv').config();
const {Transform} = require('stream');
const {join, sep} = require('path');
const {task, src, dest, parallel, series, watch} = require('gulp');
const FileHasher = require('./tasks/file-hasher');
let eleventy;
let jsChangedEmitter;

const BLACKLISTED_CSS_FILES = ['vars.css', 'normalize.css'];
const hasher = new FileHasher();

const transformCssFileNames = new Transform({
	objectMode: true,
	transform: function transformCssFileNames(file, enc, cb) {
		const finalFileName = file.relative.split(sep).pop();
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

task('js', () => new Promise((resolve, reject) => {
	const {spawn} = require('child_process');
	const rollupPath = require.resolve('rollup/dist/bin/rollup');
	let manifest;
	const isWatch = process.env.WATCH === 'true';
	const additionalFlags = isWatch ? ['-w'] : [];

	// NOTE: we can't use yarn here because we need ipc
	const cp = spawn('node', [rollupPath, '-c', ...additionalFlags], {
		stdio: ['inherit', 'inherit', 'inherit', 'ipc']
	});

	if (isWatch) {
		process.on('exit', () => {
			cp.kill('SIGTERM');
		});

		let firstTime = true;

		cp.on('message', message => {
			console.log('GOT MESSAGE', message);
			// @ts-ignore
			if (message.bundleWritten === true) {
				if (firstTime) {
					resolve();
					firstTime = false;
				} else if (jsChangedEmitter) {
					jsChangedEmitter();
				}
			}
		});
	} else {
		cp.on('message', message => {
			if (process.env.NO_CACHEBUST !== 'true') {
				manifest = require('./tasks/get-cache');
				// @ts-ignore
				for (const key in message) {
					manifest.store(key, message[key]);
				}
			}
		});

		cp.on('exit', code => {
			if (code === 0) {
				if (manifest) {
					manifest.write().then(() => resolve(code)).catch(reject);
				} else {
					resolve();
				}
			} else {
				reject(code);
			}
		});
	}
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

task('dev', series('enableWatchMode', 'default', function devServer() {
	const liveReload = require('browser-sync');
	const reload = () => liveReload.reload();
	jsChangedEmitter = reload;
	watch('./styles/**/*', series('css')).on('change', reload);
	watch(['./src/**/*.hbs','./src/**/*.md'], series('html')).on('change', reload);

	liveReload.init(require('./browser-sync.js'));
}));

task('build', series(
	'enableProdMode',
	'default',
	'html:minify'
));
