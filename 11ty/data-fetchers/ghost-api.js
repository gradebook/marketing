const ghostContentAPI = require('@tryghost/content-api');

module.exports.api = new ghostContentAPI({
  url: process.env.GHOST_API_URL,
  key: process.env.GHOST_CONTENT_API_KEY,
  version: 'v2'
});

module.exports.stripDomain = url => url.replace(process.env.GHOST_API_URL, '');
