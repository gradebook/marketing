const schema = new (require('@tryghost/schema-org'))();
const absolute = require('./absolute-url');

function createAuthorContext(author) {
	return {
		name: author.meta_title || author.name,
		url: author.website,
		sameAs: [author.facebook, author.twitter].filter(Boolean),
		image: author.profile_image,
		description: (author.meta_description || author.bio).replace(/\n/g, ' ')
	};
}

function _generateJSONLD(context) {
	const relativePath = context.page.url

	let schemaType = 'home';

	if (!relativePath) {
		console.log('⚠ No relative path!');
		console.log(context);
	}

	const metaOverrides = context.__meta || {};
	const postData = context.post || {};
	let author = {};

	const meta = {
		image: metaOverrides.image,
		description: (metaOverrides.description || context.description || '').replace(/\n/g, ' '),
		title: metaOverrides.title || context.title,
		url: absolute(relativePath)
	};

	if (relativePath.startsWith('/blog')) {
		if (relativePath.startsWith('/blog/author')) {
			schemaType = 'author';
		} else if (relativePath.startsWith('/blog/tag')) {
			schemaType = 'tag';
			meta.name = context.tag.name;
		} else if (relativePath.startsWith('/blog/page')) {
			return '';
		} else if (relativePath === '/blog/') {
			schemaType = 'home';
		} else {
			schemaType = 'post'
			author = createAuthorContext(postData.authors[0]);
			meta.datePublished = postData.published_at;
			meta.dateModified = postData.updated_at;
			meta.description = meta.description || (postData.custom_excerpt || postData.excerpt).replace(/\n/g, ' ');
			meta.title = meta.title || postData.title;
			meta.keywords = postData.tags.map(({name}) => name);
		}
	}

	const payload = JSON.stringify(schema.createSchema(schemaType, {site: {...context.site}, meta, author}), null, 2);
	return `<script type="application/ld+json">\n${payload}\n</script>`;
}

function _generateMeta(context, handlebars) {
	return _generateJSONLD(context);
}

function _storeMeta(context, name, handlebars) {
	if (!context.__meta) {
		context.__meta = {};
	}

	if (name in context.__meta) {
		console.warn('[warning] Duplicate meta property (%s) stored for %s', name, context.page.url);
	}

	context.__meta[name] = handlebars.fn(context).trim();

	return '';
}

module.exports = function generateMetaTags(...args) {
	if (args.length === 1) {
		return _generateMeta(this, args[0]);
	}

	return _storeMeta(this, args[0], args[1])
};
