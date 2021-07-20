import { defaultAppState } from '../config';
import { getUser } from './user.reducers';

describe('User Reducer Tests', () => {
	describe('reducer: getUser', () => {
		test('should return default state if invoked without a valid action and no state', () => {
			expect(getUser(undefined, {})).toBe(defaultAppState.user);
		});

		test('should return current state if invoked without a valid action', () => {
			let current = defaultAppState.user.set('status', 'SUCCESS');
			expect(getUser(current, {})).toBe(current);
		});

		test('should set the current user when we successfully retrieve the current active user', () => {
			let response = { getUser: { username: 'scooby', roles: [] } };
			let results = getUser(defaultAppState.user, { type: 'user/get', data: response });

			expect(results.get('data')).toEqual(response.getUser);
			expect(results.get('status')).toEqual('SUCCESS');
			expect(results.get('error')).toBeUndefined();
		});

		test('should set the correct status and error when unable to get the current active user', () => {
			let response = new Error('No active user logged in');
			let results = getUser(defaultAppState.user, { type: 'user/get-failure', data: response });

			expect(results.get('status')).toEqual('FAILED');
			expect(results.get('error')).toEqual(response);
		});
	});
});
