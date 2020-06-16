// @ts-check
const {resolve} = require('path');
const fs = require('fs').promises;
const postcss = require('postcss');

const FILES = [{
	input: 'ghost/screen.css',
	// output: 'blog.css',
	output: 'screen.css',
}, {
	input: 'site/style.css',
	// output: 'global.css'
	output: 'style.css'
}];

// const OUT_ROOT = resolve(__dirname, '../static/css');
const OUT_ROOT = resolve(__dirname, '../static/');
const STYLE_ROOT = resolve(__dirname, '../styles/');

const plugins = [
	require('postcss-easy-import'),
	require('autoprefixer'),
	require('postcss-custom-properties'),
	require('postcss-color-function')({
		preserveCustomProps: false
	}),
	// require('cssnano')
];

const compiler = postcss(plugins);

async function processSingleFile({input, output}) {
	try {
		const source = resolve(STYLE_ROOT, input);
		const destination = resolve(OUT_ROOT, output);

		const fileContents = await fs.readFile(source);
		const result = await compiler.process(fileContents, {
			from: source,
			to: destination
		});
		await fs.writeFile(destination, result);
	} catch (error) {
		console.log(error);
	}
}

Promise.all(FILES.map(processSingleFile));
