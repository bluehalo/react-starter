import service from './user.service';

/**
 * @function getActiveUser
 * @description Ask the server if we have an already authenticated user
 */
export function getActiveUser() {
	return (dispatch) => {
		return service
			.getActiveUser()
			.then((response) => dispatch({ type: 'user/get', data: response }))
			.catch((err) => dispatch({ type: 'user/get-failure', data: err }));
	};
}

/**
 * @function login
 * @description Attempt a login on behalf of our user
 * @param {string} username
 * @param {string} password
 */
export function login(username, password) {
	return (dispatch) => {
		return service
			.login(username, password)
			.then((response) => dispatch({ type: 'user/login', data: response }))
			.catch((err) => dispatch({ type: 'user/login-failure', data: err }));
	};
}

/**
 * @function logout
 * @description Log out our user
 */
export function logout() {
	return { type: 'user/logout' };
}
