module.exports = path => new URL(path, process.env.SITE_URL).href;
