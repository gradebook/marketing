const {URL} = require('url');
const {default: fetch} = require('node-fetch');

const cache = {};
const resources = [
	['Terms of Service', 'tos', '/terms-of-service'],
	['Privacy Policy', 'privacy', '/privacy-policy'],
	['Security', 'SECURITY', '/security']
];

/** @param {[string, string, string]} resource */
function fetchResource([name, path, dest]) {
	const url = new URL('/gradebook/legal/master/' + path + '.md', 'https://raw.githubusercontent.com/').href;
	if (cache[url]) {
		return cache[url];
	}

	return fetch(url).then(response => response.text()).then(data => {
		cache[url] = {
			markdown: data,
			title: name,
			url: dest
		};
		return cache[url];
	});
}

module.exports = () => Promise.all(resources.map(fetchResource));
