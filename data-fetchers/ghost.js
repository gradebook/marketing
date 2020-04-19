const {api, stripDomain} = require('./ghost-api');

module.exports.getPages = async () => {
	const collection = await api.pages.browse({include: 'authors', limit: 'all'}).catch(console.error);

	collection.forEach(doc => {
		doc.url = stripDomain(doc.url);
		doc.primary_author.url = stripDomain(doc.primary_author.url);

		// Convert publish date into a Date object
		doc.published_at = new Date(doc.published_at);
		return doc;
	});

	return collection;
};

module.exports.getPosts = async () => {
	const collection = await api.posts.browse({include: 'tags,authors', limit: 'all'}).catch(console.error);

	collection.forEach(post => {
		post.url = stripDomain(post.url);
		post.primary_author.url = stripDomain(post.primary_author.url);
		post.tags.map(tag => (tag.url = stripDomain(tag.url)));

		// Convert publish date into a Date object
		post.published_at = new Date(post.published_at);
	});

	// Bring featured post to the top of the list
	collection.sort((post, nextPost) => nextPost.featured - post.featured);

	return collection;
};

module.exports.getAuthors = async () => {
	const collection = await api.authors.browse({limit: 'all'}).catch(console.error);

	// Get all posts with their authors attached
	const posts = await api.posts.browse({include: 'authors', limit: 'all'}).catch(console.error);

	// Attach posts to their respective authors
	collection.forEach(author => {
		const authorsPosts = posts.filter(post => {
			post.url = stripDomain(post.url);
			return post.primary_author.id === author.id;
		});

		if (authorsPosts.length){
			author.posts = authorsPosts;
		}

		author.url = stripDomain(author.url);
	});

	return collection;
};

module.exports.getTags = async () => {
	const collection = await api.tags.browse({include: 'count.posts', limit: 'all'}).catch(console.error);

	// Get all posts with their tags attached
	const posts = await api.posts.browse({include: 'tags,authors', limit: 'all'}).catch(console.error);

	// Attach posts to their respective tags
	collection.forEach(tag => {
		const taggedPosts = posts.filter(post => {
			post.url = stripDomain(post.url);
			return post.primary_tag && post.primary_tag.slug === tag.slug;
		});

		if (taggedPosts.length) {
			tag.posts = taggedPosts;
		}

		tag.url = stripDomain(tag.url);
	});

	return collection;
};
