const {URL} = require('url');
const axios = require('axios');

const cache = {};
const resources = [
	['Terms of Service', 'tos', '/terms-of-service'],
	['Privacy Policy', 'privacy', '/privacy-policy'],
	['Security', 'SECURITY', '/security']
];

function fetchResource([name, path, dest]) {
	const url = new URL('/gradebook/legal/master/' + path + '.md', 'https://raw.githubusercontent.com/').href;
	if (cache[url]) {
		return cache[url];
	}

	return axios({method: 'GET', responseType: 'text', url}).then(({data}) => {
		cache[url] = {
			markdown: data,
			title: name,
			url: dest
		};
		return cache[url];
	});
}

module.exports = () => Promise.all(resources.map(fetchResource));
