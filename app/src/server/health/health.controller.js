/**
 * @function exports.healthcheck
 * @description Let services know we are up and running
 * @param {Express.Request} _req - Express request object
 * @param {Express.Response} res - Express response object
 */
module.exports.healthcheck = function healthcheck(_req, res) {
	return res.sendStatus(200);
};
