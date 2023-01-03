// @ts-check
const {readFile} = require('fs').promises;
const path = require('path');
const axios = require('axios').default;
const {API_VERSION} = require('./data-fetchers/ghost-api');
const dateHelper = require('./helpers/date');

const previewPath = path.resolve(__dirname, '../dist/preview-helper/index.html');

module.exports = new class PreviewManager {
	ROUTE_MATCHER = '/blog/p'

	messages = {
		noAccessToken: [
			'Missing access token',
			'Go to the "your profile" section of Ghost, and find it near the bottom of the page',
			'Once you have it, update your .env with the token:',
			'GHOST_ACCESS_TOKEN=(token)',
		],
		badId: id => [`Unable to read request as uuid - got ${id}`],
		apiError: errorResponse => [
			'Request failed',
			JSON.stringify(errorResponse.data, null, 2)
		],
		unknownError: error => [
			'An error occurred:',
			error.message,
			error.stack.replace(/\n/g, '\n  ')
		]
	}

	tokenToJwt(token) {
		const jwt = require('jsonwebtoken');
		const [id, secret] = token.split(':');

		return jwt.sign({}, Buffer.from(secret, 'hex'), { // eslint-disable-line no-undef
				keyid: id,
				algorithm: 'HS256',
				expiresIn: '5m',
				audience: `/${API_VERSION}/admin/`
		});
	}

	async getPost(uuid) {
		const url = `${process.env.GHOST_API_URL}/ghost/api/${API_VERSION}/admin/posts/?filter=uuid:${uuid}&formats=html`;
		return axios.get(url, {
			headers: {
				authorization: `Ghost ${this.tokenToJwt(process.env.GHOST_ACCESS_TOKEN)}`
			}
		}).then(response => response.data.posts[0]);
	}

	async getPreviewFile() {
		return readFile(previewPath, 'utf-8');
	}

	async render(uuid) {
		const [post, file] = await Promise.all([this.getPost(uuid), this.getPreviewFile()]);
		const markerEnd = '__marker_end__';
		const textToRemove = file.slice(file.indexOf('__marker_start__'), file.indexOf(markerEnd) + markerEnd.length);

		if (!post) {
			throw new Error(`Post with uuid "${uuid}" was not returned from the api`);
		}

		let renderedFile = file
			.replace(textToRemove, '')
			.replace(/DEC 1969/ig, dateHelper(post.published_at || post.updated_at, {hash: {format: 'MMM YYYY'}}))
			.replace('__config__', JSON.stringify({
				feature_image: Boolean(post.feature_image),
				custom_excerpt: Boolean(post.custom_excerpt)
			}));

		for (const [search, replacement] of Object.entries(this.getReplacements(post))) {
			renderedFile = renderedFile.replace(new RegExp(search, 'g'), replacement);
		}

		return renderedFile;
	}

	async middleware(request, response) {
		try {
			if (!process.env.GHOST_ACCESS_TOKEN) {
				return this.fatal(response, this.messages.noAccessToken);
			}

			const postUuid = request.url.replace(/\/$/, '').split('/').pop();
			if (!this.isUuidLike(postUuid)) {
				return this.fatal(response, this.messages.badId(postUuid));
			}

			const message = await this.render(postUuid.toLowerCase());
			response.write(message);
			response.end();
		} catch (error) {
			if (error.response) {
				this.fatal(response, this.messages.apiError(error.response));
			} else {
				this.fatal(response, this.messages.unknownError(error));
			}
		}
	}

	/**
	 * @param {string[]} message
	 */
	fatal(response, message) {
		const data = message.join('\n');
		response.write('<html><body><pre>\n');
		response.write(data);
		response.write('\n</pre></body></html>');
		response.end();
	}

	getReplacements(post) {
		const replacements = {};
		const recurse = (nestedDummyData, nestedPostData) => {
			for (const [key, value] of Object.entries(nestedDummyData)) {
				if (typeof value !== 'string') {
					if (nestedPostData && key in nestedPostData) {
						recurse(value, nestedPostData[key]);
					}

					continue;
				}

				if (!value.startsWith('__')) {
					continue;
				}

				if (value in replacements) {
					throw new Error(`Replacement ${value} is used multiple times`);
				}

				if (nestedPostData && key in nestedPostData) {
					replacements[value] = nestedPostData[key];
				}
			}
		};

		recurse(this.getDummyData()[0], post);
		return replacements;
	}

	getDummyData() {
		return [{
			url: '/preview-helper/',
			primary_author: {
				url: '__primary_author_url__'
			},
			published_at: new Date(0),
			updated_at: new Date(0),
			primary_tag: {
				name: '__primary_tag_name__'
			},
			feature_image: '__feature_image__',
			title: '__title__',
			custom_excerpt: '__custom_excerpt__',
			html: '__content__'
		}];
	}

	isUuidLike(candidate) {
		return candidate.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
	}
}();
