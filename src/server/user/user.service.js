/**
 * @function sanitizeUser
 * @description Only send back the minimal properties the client needs in
 * order for the client to function correctly. If no user is provided,
 * return an empty object as the default value
 * @param {req.user} user - Current user authenticated via passport
 * @return {object}
 */
module.exports.sanitizeUser = function (user) {
	/**
	 * email needed for base verification and display
	 * roles needed for knowing what pages the client can access in the UI
	 */
	return user === undefined
		? {}
		: {
				roles: user.roles,
				email: user.email,
		  };
};
