const fs = require('fs');

let manifest = '';

try {
	manifest = JSON.parse(fs.readFileSync('.cache-manifest', 'utf8') || '{}')
} catch {}

module.exports = manifest;
