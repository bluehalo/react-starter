const container = require('./../../lib/winston');
const logger = container.get('console');

/**
 * @function exports.healthcheck
 * @description Let services know we are up and running
 * @param {Express.Request} _req - Express request object
 * @param {Express.Response} res - Express response object
 */
module.exports.healthcheck = function healthcheck(_req, res) {
	// @TODO this returns a 304 for some reason
	logger.debug('Health check endpoint hit');
	return res.sendStatus(200);
};
