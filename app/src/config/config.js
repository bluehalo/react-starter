const path = require('path'),
	  glob = require('glob'),
	  env = require('env-var');

/**
 * @exports
 * @description Server configurations
 */
module.exports = {
	locals: {
		title: 'React Starter',
		author: 'TODO',
		keywords: 'TODO',
		description: 'TODO',
		contentSecurityPolicy: "script-src 'self' 'unsafe-eval';style-src 'self' 'unsafe-inline'",
	},
	files: {
		routes: glob.sync(path.resolve('src/server/**/*.routes.js')),
		views: glob.sync(path.resolve('src/server/**/views')),
	},
	server: {
		publicDirectory: env.get('PUBLIC_DIR').default('public').asString(),
		port: env.get('PORT').default('3000').asIntPositive(),
		logLevel: env.get('LOG_LEVEL').default('info').asString(),
		useRedis: env.get('ENABLE_REDIS').default('true').asBool(),
		session: {
			name: 'connect.id',
			// Force everyone to have a session even if they are not logged in.
			// If you are implementing login, it is better to make this false
			saveUninitialized: true,
			//Best practice, set this in your environment and use a random string of characters
			secret: env.get('SESSION_SECRET').default('6fD6pJwXBFVk6JaBRM7z').asString(), 
			resave: false,
			cookie: {
				secure: false
			}
		},
		redis: {
			host: env.get('REDIS_HOST').asString(),
			username: env.get('REDIS_USER').asString(),
			password: env.get('REDIS_PASSWORD').asString(),
			port: env.get('REDIS_PORT').default('6379').asIntPositive()
		}
	},
};
