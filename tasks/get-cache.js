const fs = require('fs');

let css = {};
let js = {};

try {
	css = JSON.parse(fs.readFileSync('css.cache-manifest', 'utf8') || '{}')
} catch {}

try {
	js = JSON.parse(fs.readFileSync('js.cache-manifest', 'utf8') || '{}')
} catch {}

module.exports = {
	getItem(item) {
		if (Reflect.has(css, item)) {
			return css[item];
		}

		if (Reflect.has(js, item)) {
			return js[item];
		}

		return item;
	},
	css,
	js
};
