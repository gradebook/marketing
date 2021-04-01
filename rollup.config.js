// @ts-check
require('dotenv').config()
import {writeFileSync} from 'fs';
import path from 'path';
import svelte from 'rollup-plugin-svelte';
import css from 'rollup-plugin-css-only';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import {terser} from 'rollup-plugin-terser';

const production = !process.env.ROLLUP_WATCH;

const ENTRYPOINTS = ['popup', 'update-cta', 'main', 'facebook', 'donate'];
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

const serve = {
	writeBundle() {
		if (process.send) {
			process.send({bundleWritten: true});
		}
	}
};

const replaceSingleton = replace({
	preventAssignment: true,
	env: JSON.stringify({
		SITE_URL: process.env.SITE_URL,
		AUTH_URL: process.env.AUTH_URL
	})
});

const plugins = [
	replaceSingleton,
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
		replaceSingleton,
		svelte({
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production,
			}
		}),
		css({
			output(css) {
				let outputFileName = 'signup.css';
				if (hashFile.renderChunk) {
					const ref = {fileName: outputFileName};
					hashFile.renderChunk(css, ref);
					outputFileName = ref.fileName;
				}

				writeFileSync(path.resolve(__dirname, './dist/built/', outputFileName), css);
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

		!production && serve,

		// If we're building for production, minify
		production && terser(),
		writeHashes,
		hashFile
	],
	watch: {
		clearScreen: false
	}
}];

