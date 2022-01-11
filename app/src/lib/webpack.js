const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const container = require('./winston');
const webpack = require('webpack');

let logger = container.get('console');

let toStringOptions = {
	errorDetails: true,
	warnings: true,
	modules: false,
	chunks: false,
	colors: true,
};

/**
 * @function compile
 * @param {object} config - Webpack configurations
 */
module.exports.compile = function compile(config) {
	return new Promise((resolve, reject) => {
		logger.info('Compiling our production assets.');
		let compiler = webpack(config);

		compiler.run((err, stats) => {
			if (err) {
				return reject(err);
			}

			console.log(`\n${stats.toString(toStringOptions)}\n`);
			resolve();
		});
	});
};

/**
 * @function middleware
 * @param {object} config - Webpack configurations
 */
module.exports.middleware = function middleware(config) {
	let compiler = webpack(config);
	return {
		webpackDevMiddleware: webpackDevMiddleware(compiler, { publicPath: config.output.publicPath }),
		webpackHotMiddleware: webpackHotMiddleware(compiler),
	};
};

/**
 * @function parseAssetPaths
 * @description Parse assets from a stats.json entry. We use a plugin to write
 * out a stats file and the assetsByChunkName can either be an array or can be
 * a string. If it's an array, it contains the path to our critical css and js
 */
module.exports.parseAssetPaths = function parseAssetPaths(asset) {
	// If we have an array, locate the js and css assets
	if (Array.isArray(asset)) {
		// This may not exist
		let cssIndex = asset.findIndex((str) => str.endsWith('css'));
		// This will always find something
		let jsIndex = asset.findIndex((str) => str.endsWith('js'));

		return { css: asset[cssIndex] || '', js: asset[jsIndex] };
	}
	// First load with HMR, asset is a string, we never have css assets in dev
	// Also, Common module in production is also a string
	// Also Also, this is the default case
	return { css: '', js: asset };
};
