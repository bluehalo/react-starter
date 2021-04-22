/**
 * @function wrapper
 * @description Wrapper for async/await error handling
 * @see async.utils.test.js for examples
 */
module.exports.wrapper = (promise) => promise.then((data) => [undefined, data]).catch((err) => [err]);

/**
 * @function middleware
 * @description Middleware wrapper for async/await error handling
 * @see async.utils.test.js for examples
 */
module.exports.middleware = (controller) => (req, res, next) => {
	return Promise.resolve(controller(req, res, next)).catch(next);
};

/**
 * @function regardless
 * @description Similar to promise.all, but resolve regardless if one of the promises errors out
 * @see async.utils.test.js for examples
 */
module.exports.regardless = (promises) => {
	return Promise.all(
		promises.map(
			(promise) =>
				new Promise((resolve) => {
					promise.then(resolve).catch(resolve);
				}),
		),
	);
};
