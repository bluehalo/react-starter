import superagent from 'superagent';

/**
 * @module UserService
 * @description All requests related to user functionality
 */
export default {
	/**
	 * @function login
	 * @description Authenticate a user
	 * @param {string} username
	 * @param {string} password
	 */
	login(username, password) {
		return superagent.post('/api/user/login').send({ username, password });
	},
	/**
	 * @function getActiveUser
	 * @description Get the active user
	 */
	getActiveUser() {
		return superagent.get('/api/user/active');
	},
};
