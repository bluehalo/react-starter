const path = require('path');
const glob = require('glob');

/**
 * @exports
 * @description Server configurations
 */
module.exports = {
	locals: {
		title: 'React Starter',
		author: 'Asymmetrik Ltd.',
		keywords: 'TODO',
		description: 'TODO',
		contentSecurityPolicy: "script-src 'self' 'unsafe-eval';style-src 'self' 'unsafe-inline';",
	},
	files: {
		mutations: glob.sync(path.resolve('src/server/**/*.mutation.js')),
		queries: glob.sync(path.resolve('src/server/**/*.query.js')),
		routes: glob.sync(path.resolve('src/server/**/*.routes.js')),
		views: glob.sync(path.resolve('src/server/**/views')),
	},
	server: {
		publicDirectory: process.env.PUBLIC_DIR || 'public',
		port: process.env.PORT || 3000,
	},
};
