import { defaultAppState } from '../config';
import { fromJS } from 'immutable';

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
		// Successfully got a user
		case 'user/get':
			return state.withMutations((user) => {
				user.set('status', 'SUCCESS').set('error', undefined).set('data', fromJS(data.getUser));
			});
		// Unable to retrieve a user
		case 'user/get-failure':
			return state.withMutations((user) => {
				user.set('status', 'FAILED').set('error', data);
			});
		default:
			return state;
	}
}
