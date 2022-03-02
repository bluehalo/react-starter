import produce from 'immer';
import { defaultAppState } from '../config';

/**
 * @function getUser
 * @description Fetch the current authenticated user for the application
 * @param state
 * @param action
 * @return {Object}
 */
export function getUser(state = defaultAppState.user, action) {
	let { type, data } = action;
	let nextState;

	switch (type) {
		// User has logged in successfully or we were able to successfully
		// get an authenticated user through another means (PKI, Session, etc.)
		case 'user/get':
		case 'user/login':
			nextState = produce(state, (mutateState) => {
				mutateState.status = 'SUCCESS';
				mutateState.error = undefined;
				mutateState.data = data;
			});
			return nextState;
		// User was unable to login for some reason or
		// we are unable to get the current user
		case 'user/get-failure':
		case 'user/login-failure':
			nextState = produce(state, (mutateState) => {
				mutateState.status = 'FAILED';
				mutateState.error = data;
				mutateState.data = undefined;
			});
			return nextState;
		// User logging out, reset all defaults
		case 'user/logout':
			return defaultAppState.user;
		default:
			return state;
	}
}
