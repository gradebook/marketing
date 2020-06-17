# Gradebook Marketing

This is the code that powers the Gradebook Marketing site.

We ask that you don't clone the content of the site, but you are free to get inspiration from the project - if you find the project architecture, design, etc. interesting, we welcome you to use it!

## Getting Started

Gradebook uses the latest version of Node LTS. Please ensure you have this installed to ensure maximum compatibility

1. Clone the repository

1. Install dependencies - run `yarn install`

1. Copy `.env.example` to `.env` and update the environment variables as needed


## Development

The commands you need to run are dependent on what you're trying to do.

 - For most tasks, you need gulp running - run `yarn dev` to start a live server

 - For Svelte Apps, you need to use rollup - run `yarn rollup -c -w` to compile the app and start a live server. Do not start the gulp live server.

	 - Before starting, you'll probably need to build w/ eleventy once - run `yarn build`. Make sure `NO_CACHEBUST=true` in your env file. If you don't want to fetch from external sources, make sure `NO_FETCH=true`.

	 - If you make changes to the global `{page}.css` file, you will need to rebuild w/ eleventy.