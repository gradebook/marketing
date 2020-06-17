// @ts-check
const {Transform} = require('stream');
const {minify: runMinify} = require('html-minifier');
const {WriteStream} = require('fs');

const MINIFY_OPTIONS = {
	useShortDoctype: true,
	removeComments: true,
	collapseWhitespace: true,
	minifyCSS: true
};

/**
 * @param {Buffer | string} input
 * @returns {Buffer}
 */
function minify(input) {
	const stringRep = input.toString();
	return Buffer.from(
		runMinify(stringRep, MINIFY_OPTIONS)
	)
}

/**
 * @param {NodeJS.ReadableStream} input
 * @returns {Promise<Buffer>}
 */
function minifyStream(input) {
	return new Promise((resolve, reject) => {
		let buffer = '';
		const stream = new Transform({
			transform(chunk, encoding, callback) {
				buffer += chunk.toString();
				callback(null);
			}
		});

		stream.on('error', (error) => {
			stream.destroy();
			reject(error);
		});

		stream.on('end', () => {
			resolve(minify(buffer));
		});

		input.pipe(stream);
	});
}

module.exports = new Transform({
	objectMode: true,
	/**
	 * @param {import('vinyl')} file
	 * @param {BufferEncoding} unused
	 * @param {() => void} callback
	 */
	transform: function htmlMinTransform(file, unused, callback) {
		if (file.isNull()) {
			return callback(null);
		}
		try {
			if (file.isStream()) {
				minifyStream(file.contents).then(minified => {
					// @ts-ignore
					file.contents = minified.toString();
					callback();
				});
			} else if (file.isBuffer()) {
				file.contents = minify(file.contents);
				callback();
			}

			this.push(file);
		} catch (error) {
			console.log(error)
		}
	}
});
