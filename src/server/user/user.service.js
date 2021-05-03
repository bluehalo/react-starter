const { User } = require('./user.model');

/**
 * @function getUser
 * @description Retrieve the current user
 * @param {Express.Request} req - Express request object
 * @return {User}
 */
module.exports.getUser = function (req) {
	// TODO: Implement
	return new User();
};

/**
 * @function login
 * @description Authenticate a user request
 * @param {Express.Request} req - Express request object
 * @return {User}
 */
module.exports.login = function (req) {
	// TODO: Implement
	return new User();
};
