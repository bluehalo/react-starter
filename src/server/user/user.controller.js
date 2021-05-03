const userService = require('./user.service');
const container = require('../../lib/winston');

// eslint-disable-next-line no-unused-vars
let logger = container.get('console');

/**
 * @function exports.getActiveUser
 * @description Get the current logged in user
 * @param {Express.Request} req - Express request object
 * @param {Express.Response} res - Express response object
 */
module.exports.getActiveUser = function getActiveUser(req, res) {
	// TODO: Add error handling when adding real implementation
	return res.status(200).json(userService.getUser(req));
};

/**
 * @function exports.login
 * @description Attempt to login a user
 * @param {Express.Request} req - Express request object
 * @param {Express.Response} res - Express response object
 */
module.exports.login = function login(req, res) {
	// TODO: Implement user authentication
	return res.status(200).json(userService.getUser(req));
};
