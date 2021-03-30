/**
 * @function getEnvironment
 * @description Define feature flags available during a webpack compilation
 * @return {object} environment settings
 */
module.exports = function getEnvironment() {
	// Feature flags that can be accessed as environment variables in client
	let flags = {
		BABEL_ENV: process.env.BABEL_ENV || 'production',
		NODE_ENV: process.env.NODE_ENV || 'production',
	};

	return {
		'process.env': Object.keys(flags).reduce((env, key) => {
			env[key] = JSON.stringify(flags[key]);
			return env;
		}, {}),
	};
};
