// @ts-check
require('dotenv').config()
import svelte from 'rollup-plugin-svelte';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import {terser} from 'rollup-plugin-terser';

const production = !process.env.ROLLUP_WATCH;

const ENTRYPOINTS = ['popup', 'update-cta', 'main', 'facebook'];
const entrypointCompilers = [];

let hashFile = {};
let writeHashes = {};

if (process.env.NO_CACHEBUST !== 'true') {
	const manifest = require('./tasks/get-cache');
	hashFile.renderChunk = (code, chunk) => {
		chunk.fileName = manifest.transform(chunk.fileName, code);
	};

	writeHashes.generateBundle = () => manifest.write();
}

const plugins = [
	replace({
		env: JSON.stringify({
			SITE_URL: process.env.SITE_URL,
			AUTH_URL: process.env.AUTH_URL
		})
	}),
	resolve({
		browser: true,
		dedupe: ['svelte']
	}),
	commonjs(),
	production && terser(),
	hashFile
];

for (const entrypoint of ENTRYPOINTS) {
	entrypointCompilers.push({
		input: `scripts/${entrypoint}.js`,
		output: {
			sourcemap: false,
			format: 'iife',
			name: entrypoint.replace(/-(.)/, (_, t) => t.toUpperCase()),
			file: `dist/built/${entrypoint}.js`
		},
		plugins
	})
}

export default [...entrypointCompilers, {
	input: 'scripts/signup/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'dist/built/signup.js'
	},
	plugins: [
		replace({
			env: JSON.stringify({
				SITE_URL: process.env.SITE_URL,
				AUTH_URL: process.env.AUTH_URL
			})
		}),
		svelte({
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file - better for performance
			css: css => {
				let outputFileName = 'dist/built/signup.css';
				if (hashFile.renderChunk) {
					const ref = {fileName: outputFileName};
					hashFile.renderChunk(css.code, ref);
					outputFileName = ref.fileName;
				}

				css.write(outputFileName);
			}
		}),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser(),
		writeHashes,
		hashFile
	],
	watch: {
		clearScreen: false
	}
}];

function serve() {
	let liveReloadInstance;

	return {
		writeBundle() {
			if (!liveReloadInstance) {
				liveReloadInstance = require('browser-sync');

				liveReloadInstance.init({
					server: {
						baseDir: './dist/'
					},
					watch: false,
					open: false,
					notify: false
				});
			}
		}
	};
}
