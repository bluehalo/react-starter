/**
 * @function wrapper
 * @description Wrapper for async/await error handling
 */
module.exports.wrapper = (promise) => promise.then((data) => [undefined, data]).catch((err) => [err]);

/**
 * @function middleware
 * @description Middleware wrapper for async/await error handling
 */
module.exports.middleware = (controller) => (req, res, next) => {
	return Promise.resolve(controller(req, res, next)).catch(next);
};
