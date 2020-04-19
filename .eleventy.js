require('dotenv').config();

const pluginRSS = require('@11ty/eleventy-plugin-rss');
// const localImages = require('eleventy-plugin-local-images');
// const lazyImages = require('eleventy-plugin-lazyimages');
const ghost = require('./data-fetchers/ghost');
const time = require('./data-fetchers/timer');

const htmlMinTransform = require('./transformers/html-min-transform.js');

module.exports = function(config) {
  // Minify HTML
  config.addTransform('htmlmin', htmlMinTransform);

  // Assist RSS feed template
  config.addPlugin(pluginRSS);

  // Apply performance attributes to images
  /* config.addPlugin(lazyImages, {
    cacheFile: ''
  }); */

  // Copy images over from Ghost
  /* config.addPlugin(localImages, {
    distPath: 'dist',
    assetPath: '/assets/images',
    selector: 'img',
    attribute: 'data-src', // Lazy images attribute
    verbose: false
  }); */

	config.addPairedShortcode('block', (content, context, blockName) => {
		if (!context._blockData) {
			context._blockData = {};
		}

		if (context._blockData[blockName]) {
			console.warn('Warning: Duplicate block "%s" used for %s', blockName, context.permalink);
		}

		context._blockData[blockName] = content;
	});

	config.addHandlebarsHelper('pagination', function (options) {
		const {pagination, page} = this;
		if (!pagination.previousPageHref && !pagination.nextPageHref) {
			return options.inverse(this);
		}

		const previous = (page.permalink === pagination.previousPageHref) ? null : pagination.previousPageHref;
		const next = (page.permalink === pagination.nextPageHref) ? null : pagination.nextPageHref;

		return options.fn({previous, next});
	});

	config.addFilter('blockContent', (context, blockName) => {
		return context._blockData && context._blockData[blockName] || '';
	});

	config.addFilter('sass', file => {
		if (process.env.ELEVENTY_ENV === 'dev') {
			return file.replace('scss', 'css');
		}

		throw new Error('sass conversion in prod has not been implemented yet');
	});

  config.addFilter('getReadingTime', text => {
    const wordsPerMinute = 200;
    const numberOfWords = text.split(/\s/g).length;
    return Math.ceil(numberOfWords / wordsPerMinute);
  });

  // Date formatting filter
  config.addFilter('htmlDateString', dateObj => {
    return new Date(dateObj).toISOString().split('T')[0];
  });

  // Don't ignore the same files ignored in the git repo
  config.setUseGitIgnore(false);

  // Get all pages, called 'docs' to prevent conflicting the eleventy page object
  config.addCollection('docs', time(ghost.getPages, 'Fetch Pages', false));
  config.addCollection('posts', time(ghost.getPosts, 'Fetch Posts', false));
  config.addCollection('authors', time(ghost.getAuthors, 'Fetch Authors', false));
  config.addCollection('tags', time(ghost.getTags, 'Fetch Tags', false));

	config.addPassthroughCopy('static');

  /* // Display 404 page in BrowserSnyc
  config.setBrowserSyncConfig({
    callbacks: {
      ready: (err, bs) => {
        const content_404 = fs.readFileSync('dist/404.html');

        bs.addMiddleware('*', (req, res) => {
          // Provides the 404 content without redirect.
          res.write(content_404);
          res.end();
        });
      }
    }
  }); */

  // Eleventy configuration
  return {
    dir: {
      input: '11ty',
			output: '11ty-dist',
			layouts: 'layouts'
    },

    // Files read by Eleventy, add as needed
    templateFormats: ['hbs', 'md'],
    htmlTemplateEngine: 'hbs',
    markdownTemplateEngine: 'hbs',
    passthroughFileCopy: true
  };
};
