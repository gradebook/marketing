require('dotenv').config();

const cleanCSS = require('clean-css');
const fs = require('fs');
const pluginRSS = require('@11ty/eleventy-plugin-rss');
// const localImages = require('eleventy-plugin-local-images');
// const lazyImages = require('eleventy-plugin-lazyimages');
const ghost = require('./data-fetchers/ghost');

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

  // Inline CSS
  config.addFilter('cssmin', code => {
    return new cleanCSS({}).minify(code).styles;
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
  config.addCollection('docs', ghost.getPages);
  config.addCollection('posts', ghost.getPosts);
  config.addCollection('authors', ghost.getAuthors);
  config.addCollection('tags', ghost.getTags);

	config.addPassthroughCopy('static');

  // Display 404 page in BrowserSnyc
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
  });

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
