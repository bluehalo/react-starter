import { defaultAppState } from '../config';

/**
 * @function getUser
 * @description Fetch the current authenticated user for the application
 * @param state
 * @param action
 * @return {Immutable.Map}
 */
export function getUser(state = defaultAppState.user, action) {
	let { type, data } = action;

	switch (type) {
		// User has logged in successfully or we were able to successfully
		// get an authenticated user through another means (PKI, Session, etc.)
		case 'user/get':
		case 'user/login':
			return state.withMutations((user) => {
				user.set('status', 'SUCCESS')
					.set('error', undefined)
					// data is the http respons in this case, needs to be ocnverted to Map
					// .set('data', data);
					.set('data', defaultAppState.user.get('data'));
			});
		// User was unable to login for some reason or
		// we are unable to get the current user
		case 'user/get-failure':
		case 'user/login-failure':
			return state.withMutations((user) => {
				user.set('status', 'FAILED').set('error', data);
			});
		// User logging out, reset all defaults
		case 'user/logout':
			return defaultAppState.user;
		default:
			return state;
	}
}
