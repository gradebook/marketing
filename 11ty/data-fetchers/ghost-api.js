const ghostContentAPI = require('@tryghost/content-api');

module.exports.API_VERSION = 'v3.42';

module.exports.api = new ghostContentAPI({
  url: process.env.GHOST_API_URL,
  key: process.env.GHOST_CONTENT_API_KEY,
  version: module.exports.API_VERSION
});

module.exports.stripDomain = url => url.replace(process.env.GHOST_SITE_URL || process.env.GHOST_API_URL, '');
