const path = require('path'),
	  glob = require('glob'),
	  env = require('env-var');

/**
 * @exports
 * @description Server configurations based off either environment variables or hardcoded values
 * @summary The main idea here is to keep all containers identical, aka deploy your code to dev to
 * test it and then migrate the same image to prod. To help accomplish that, instead of using env files
 * the config file expects any info that could be different between environments to be passed in via
 * environment variables.
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
		logLevel: env.get('LOG_LEVEL').default('info').asString(),
		listener: {
			port: env.get('PORT').default('3000').asIntPositive(),
			enableSsl: env.get('ENABLE_SSL').default('false').asBool(),
			sslCert: env.get('SSL_CERT').asString(),
			sslKey: env.get('SSL_KEY').asString(),
			sslKeyPassphrase: env.get('SSL_KEY_PASSWORD').asString()
		},
		cors: {
			// @link: https://www.npmjs.com/packages/cors#configuration-options
			config: {
				// origin: "*",
				origin: false, //enable cors via this line
				methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
				preflightContinue: false,
				optionsSuccessStatus: 204,
			}
		},
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
			enabled: env.get('ENABLE_REDIS').default('true').asBool(),
			host: env.get('REDIS_HOST').asString(),
			username: env.get('REDIS_USER').asString(),
			password: env.get('REDIS_PASSWORD').asString(),
			port: env.get('REDIS_PORT').default('6379').asIntPositive()
		}
	},
};
