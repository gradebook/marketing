require('dotenv').config();

const pluginRSS = require('@11ty/eleventy-plugin-rss');
// const localImages = require('eleventy-plugin-local-images');
// const lazyImages = require('eleventy-plugin-lazyimages');
const ghost = require('./data-fetchers/ghost');
const time = require('./data-fetchers/timer');
const helpers = require('./helpers');

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

	config.addPairedShortcode('block', helpers.block);
	config.addHandlebarsHelper('pagination', helpers.pagination);
	config.addHandlebarsHelper('absolute_url', helpers.absoluteURL);
	config.addHandlebarsHelper('img_url', helpers.imageURL);
	config.addFilter('sass', helpers.sass);
	config.addFilter('reading_time', helpers.readingTime);
	config.addFilter('date', helpers.date);
	config.addFilter('blockContent', helpers.block.content);


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
