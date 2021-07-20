/**
 * @class User
 * @description Model for our users
 */
class User {
	constructor(options = {}) {
		this.id = options.id;
		this.roles = options.roles || [];
	}
}

module.exports = {
	User,
};
