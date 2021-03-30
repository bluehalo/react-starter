const { sanitizeUser } = require('./user.service');
const container = require('../../lib/winston');

// eslint-disable-next-line no-unused-vars
let logger = container.get('console');

/**
 * @function exports.getActiveUser
 * @description If a user is logged in, retrieve a subset of the user record to return to the client
 * @param {Express.Request} req - Express request object
 * @param {Express.Response} res - Express response object
 */
module.exports.getActiveUser = function getActiveUser(req, res) {
	// Assuming we are using passport, this will grab and sanitize the current user
	let response = {
		user_data: sanitizeUser(req.user),
		success: req.user !== undefined,
	};

	return res.status(200).json(response);
};

/**
 * @function exports.login
 * @description Attempt to login a user
 * @param {Express.Request} req - Express request object
 * @param {Express.Response} res - Express response object
 */
module.exports.login = function login(req, res) {
	// TODO: Implement user authentication
	let response = {
		user_data: undefined,
		success: false,
	};

	return res.status(200).json(response);
};
