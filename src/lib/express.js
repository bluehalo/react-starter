const { setupExpressGraphQL } = require('./graphql');
const { parseAssetPaths } = require('./webpack');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const express = require('express');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');

/**
 * @class Server
 * @description Logging container for the application
 */
module.exports = class Server {
	constructor() {
		// Setup express
		this.app = express();
		// Always return self for chaining
		return this;
	}

	/**
	 * @method configureMiddleware
	 * @description Enable all the standard middleware
	 */
	configureMiddleware() {
		this.app.set('showStackError', true);
		this.app.set('jsonp callback', true);
		this.app.use(compression({ level: 9 }));
		this.app.use(bodyParser.urlencoded({ extended: true }));
		this.app.use(bodyParser.json());

		return this;
	}

	/**
	 * @method configureMiddleware
	 * @description Enable all the standard middleware
	 * @param {object} locals - Locals for express to use in rendering pages
	 */
	configureLocals(locals = {}) {
		this.app.locals.title = locals.title;
		this.app.locals.author = locals.author;
		this.app.locals.keyword = locals.keyword;
		this.app.locals.description = locals.description;
		this.app.locals.contentSecurityPolicy = locals.contentSecurityPolicy;

		return this;
	}

	/**
	 * @method configureSession
	 * @description Set up express session
	 */
	configureSession() {
		this.app.use(
			session({
				saveUninitialized: true,
				secret: 'keyboard-cat',
				resave: true,
			}),
		);

		return this;
	}

	/**
	 * @method configurePassport
	 * @description Set up passport and strategies
	 */
	configurePassport() {
		this.app.use(passport.initialize());
		this.app.use(passport.session());
		// Configure passport and setup and strategies
		require('./passport').initialize();

		return this;
	}

	/**
	 * @method configureViewEngine
	 * @description Set the default view engine to use with express
	 * @param {string} engine="default" - View engine to use
	 * @param {string} views="" - Comma separated list of views
	 */
	configureViewEngine(engine = 'pug', views = '') {
		this.app.set('view engine', engine);
		this.app.set('views', views);

		return this;
	}

	/**
	 * @method configureHelmet
	 * @description Enable default settings for security related express headers
	 * See https://helmetjs.github.io/ for defaults
	 */
	configureHelmet() {
		// TODO: This is disabled so GraphiQL can run, we can probably play around with some
		// more optimal ways of setting a specific policy instead of disabling it completely
		this.app.use(
			helmet({
				contentSecurityPolicy: false,
			}),
		);

		return this;
	}

	/**
	 * @method setupGraphQL
	 * @description Use this to configure GraphQL in Express
	 * @param {object} context - Any additional context to pass to the resolvers
	 */
	configureGraphQL(context = {}) {
		this.app.use('/api/graphql', setupExpressGraphQL(context));

		return this;
	}

	/**
	 * @method setPublicDirectory
	 * @description Set public directory to load assets from
	 * @param {string} directory='' - directory in bin we want to expose as public
	 * @note `bin` is the directory we build static assets in, if that changes
	 * we need to update the default setting here
	 */
	setPublicDirectory(directory = '') {
		this.app.use('/public', express.static(path.join('bin', directory)));

		return this;
	}

	/**
	 * @method setPublicRoutes
	 * @description Set any public routes
	 * @param {Array<string>} routes=[] - Array of filepaths to modules that expose
	 * a single function that accepts an express app as it's argument and uses that
	 * to set itself up with express
	 */
	setPublicRoutes(routes = []) {
		routes.forEach((route) => this.app.use(require(route)));

		return this;
	}

	/**
	 * @method setSPARoute
	 * @description Add an endpoint for the single page application
	 */
	setSPARoute() {
		let statsPath = path.resolve('bin/stats.json');
		let binPath = path.resolve('bin');
		let css = '';
		// This is a catch all for the SPA, you should be mindful when developing
		// not to have any public routes that match routes defined in your client
		// side router. The public routes would get invoked and block your SPA from
		// loading the correct content on a page refresh
		this.app.get('*', (req, res) => {
			// Grab our stats, this will be cached in production
			if (process.env.NODE_ENV === 'development') {
				delete require.cache[statsPath];
			}

			let stats = require(statsPath);
			// Parse out code paths and styles, the format of this changes from
			// development to production. The main chunk in dev is a string, in prod,
			// it is an array with the path to a css asset that needs to be inlined
			let { js: jsCommon } = parseAssetPaths(stats.assetsByChunkName.common || '');
			let { css: cssMain, js: jsMain } = parseAssetPaths(stats.assetsByChunkName.main);

			// Grab our css file as plaintext
			if (cssMain) {
				css = fs.readFileSync(path.join(binPath, stats.publicPath, cssMain), {
					encoding: 'utf-8',
				});
			}

			// Send back our core template
			res.status(200).render('core', {
				commonSrc: path.join(stats.publicPath, jsCommon),
				mainSrc: path.join(stats.publicPath, jsMain),
				css: css,
			});
		});

		return this;
	}

	/**
	 * @method listen
	 * @description Start listening on the configured port
	 * @param {number} port - Defualt port to listen on
	 * @param {function} [callback] - Optional callback for listen
	 */
	listen(port, callback) {
		this.app.listen(port, callback);

		return this;
	}
};
