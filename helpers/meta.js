const schema = new (require('@tryghost/schema-org'))();
const absolute = require('./absolute-url');

const first = (...args) => args.find(arg => Boolean(arg)) || '';
const OG_AND_TWITTER = ['title', 'url']

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

function computeProperties(context) {
	const relativePath = context.page.url;
	const metaOverrides = context.__meta || {};
	const postData = context.post || {};

	context.post = postData;

	let contextMutex = false;

	if (!relativePath) {
		console.log('⚠ No relative path!');
		console.log(context);
		contextMutex = true;
	}

	if (context.__computedMeta) {
		console.log('⚠ computeProperties was already run');
		if (!contextMutex) {
			console.log(context);
		}
	}

	context.__computedMeta = {
		url: absolute(relativePath),
		image: first(metaOverrides.image, context.image, postData.feature_image),
		title: first(metaOverrides.title, context.title, postData.meta_title, postData.title),
		description: first(
			metaOverrides.description,
			context.description,
			postData.meta_description,
			postData.custom_excerpt,
			postData.excerpt
		).replace(/\n/g, ' ')
	};
}

function _generateMetaTags(context) {
	const computedProps = context.__computedMeta;
	const {post} = context;
	const tags = new Map();

	tags.set('og:type', 'website');
	tags.set('og:locale', 'en');

	tags.set('twitter:card', 'summary_large_image');
	tags.set('twitter:site', context.twitter.site);

	tags.set('og:url', computedProps.url);
	tags.set('twitter:url', computedProps.url);

	tags.set('og:description', first(post.og_description, computedProps.description).replace(/\n/g, ' '));
	tags.set('twitter:description', first(post.twitter_description, computedProps.description).replace(/\n/g, ' '));

	tags.set('og:image', first(post.og_image, computedProps.image));
	tags.set('twitter:image', first(post.twitter_image, computedProps.image));

	tags.set('og:site_name', context.site.title);
	tags.set('article:author', context.site.url);

	tags.set('og:title', computedProps.title + ' - ' + context.site.title);
	tags.set('twitter:title', computedProps.title + ' - ' + context.site.title);

	// @todo: remove once optional chaining is available
	// @todo: node 14 node v14
	if (post.primary_author && post.primary_author.twitter) {
		tags.set('creator', post.primary_author.twitter);
	}

	for (const [key, value] of tags.entries()) {
		//@TODO @VERY_IMPORTANT Escape!
		if (value) {
			output += `<meta name="${key}" content="${value}" />\n`;
		}
	}
}

function _generateJSONLD(context) {
	const relativePath = context.page.url

	let schemaType = 'home';

	const {post} = context;
	let author = {};

	const meta = {...context.__computedMeta};

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
			author = createAuthorContext(post.primary_author);
			meta.datePublished = post.published_at;
			meta.dateModified = post.updated_at;
			meta.keywords = post.tags.map(({name}) => name);
		}
	}

	const payload = JSON.stringify(schema.createSchema(schemaType, {site: {...context.site}, meta, author}), null, 2);
	return `<script type="application/ld+json">\n${payload}\n</script>`;
}

function _generateMeta(context, handlebars) {
	computeProperties(context);
	return _generateMetaTags(context) + _generateJSONLD(context);
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
