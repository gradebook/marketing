const schema = new (require('@tryghost/schema-org'))();
const absolute = require('./absolute-url');

const first = (...args) => args.find(arg => Boolean(arg)) || '';

function createAuthorContext(author) {
	return {
		name: first(author.meta_title, author.name),
		url: author.website,
		// @todo: socialURLs
		sameAs: [author.facebook, author.twitter].filter(Boolean),
		image: author.profile_image,
		description: first(author.meta_description, author.bio).replace(/\n/g, ' ')
	};
}

function _generateOpenGraphTags(context) {
	const relativePath = context.page.url;

	const metaOverrides = context.__meta || {};
	const postData = context.post || {};
	const tags = new Map([['type', 'website'], ['locale', 'en']]);

	tags.set('url', absolute(relativePath));
	tags.set('description', first(
		metaOverrides.description,
		context.description,
		postData.twitter_description,
		postData.custom_excerpt,
		postData.excerpt
	).replace(/\n/g, ' '));

	tags.set('image', first(metaOverrides.image, postData.twitter_image, postData.feature_image));
	tags.set('title', first(metaOverrides.title, postData.twitter_title, postData.title) + ' - ' + context.site.title);
	tags.set('site_name', context.site.title);

	let output = '';
	for (const [key, value] of tags.entries()) {
		//@TODO @VERY_IMPORTANT Escape!
		if (value) {
			output += `<meta name="og:${key}" content="${value}" />\n`;
		}
	}

	if (context.site.url) {
		output += `<meta name="article:author" content="${context.site.url}">\n`;
	}

	return output;
}

function _generateTwitterTags(context) {
	const relativePath = context.page.url;

	const metaOverrides = context.__meta || {};
	const postData = context.post || {};
	const tags = new Map([['card', 'summary_large_image']]);

	if (context.site.twitter) {
		tags.set('site', context.twitter.site);
	}

	if (postData.primary_author && postData.primary_author.twitter) {
		tags.set('creator', postData.primary_author.twitter);
	}

	tags.set('url', absolute(relativePath));
	tags.set('description', first(
		metaOverrides.description,
		context.description,
		postData.twitter_description,
		postData.custom_excerpt,
		postData.excerpt
	).replace(/\n/g, ' '));

	tags.set('image', first(metaOverrides.image, postData.twitter_image, postData.feature_image));
	tags.set('title', first(metaOverrides.title, postData.twitter_title, postData.title) + ' - ' + context.site.title);

	let output = '';
	for (const [key, value] of tags.entries()) {
		//@TODO @VERY_IMPORTANT Escape!
		if (value) {
			output += `<meta name="twitter:${key}" content="${value}" />\n`;
		}
	}

	return output;
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
		description: first(metaOverrides.description, context.description).replace(/\n/g, ' '),
		title: first(metaOverrides.title, context.title),
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
			author = createAuthorContext(postData.primary_author);
			meta.datePublished = postData.published_at;
			meta.dateModified = postData.updated_at;
			meta.description = first(meta.description, postData.custom_excerpt, postData.excerpt).replace(/\n/g, ' ');
			meta.title = first(meta.title, postData.title);
			meta.keywords = postData.tags.map(({name}) => name);
		}
	}

	const payload = JSON.stringify(schema.createSchema(schemaType, {site: {...context.site}, meta, author}), null, 2);
	return `<script type="application/ld+json">\n${payload}\n</script>`;
}

function _generateMeta(context, handlebars) {
	return _generateTwitterTags(context) + _generateOpenGraphTags(context) + _generateJSONLD(context);
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
