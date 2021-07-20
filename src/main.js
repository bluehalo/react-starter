const { wrapper } = require('./utils/async.utils');
const container = require('./lib/winston');
const compiler = require('./lib/webpack');
const config = require('./config/config');
const Server = require('./lib/express');

/**
 * @function main
 * @description Setup server and start the application
 * @param {object} webpackConfig - Webpack configurations
 */
module.exports = async function main(webpackConfig) {
	// Grab the development console logger
	let logger = container.get('console');

	// Start setting up our server
	logger.info('Initializing server');
	let server = new Server()
		.configureMiddleware()
		.configureSession()
		.configurePassport()
		.configureHelmet()
		.configureViewEngine('pug', config.files.views)
		.configureLocals(config.locals);

	// Compile our webpack assets for the correct environment
	if (process.env.NODE_ENV === 'development') {
		let { webpackDevMiddleware, webpackHotMiddleware } = compiler.middleware(webpackConfig);
		server.app.use(webpackDevMiddleware);
		server.app.use(webpackHotMiddleware);
	} else {
		let [compilerErr] = await wrapper(compiler.compile(webpackConfig));
		if (compilerErr) {
			logger.error('Error compiling assets with webpack.');
			throw compilerErr;
		}
	}

	// TODO: If using a DB, setup a connection here

	// Finish setting up the server
	// For configureGraphQL, you can give it a context object to be passed in to your resolvers,
	// this will make it easy for your resolvers to access a database object and query it
	server
		.configureGraphQL()
		.setPublicDirectory(config.server.publicDirectory)
		.setPublicRoutes(config.files.routes)
		.setSPARoute()
		.listen(config.server.port);

	logger.info(`Server listening on port: ${config.server.port}`);
};
