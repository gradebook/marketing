const fs = require('fs');

let css = '';
let js = '';

try {
	css = JSON.parse(fs.readFileSync('css.cache-manifest', 'utf8') || '{}')
} catch {}

try {
	js = JSON.parse(fs.readFileSync('js.cache-manifest', 'utf8') || '{}')
} catch {}

module.exports = {
	all: {
		...css,
		...js
	},
	css,
	js
};
