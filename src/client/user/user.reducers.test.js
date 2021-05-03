import { defaultAppState } from '../config';
import { getUser } from './user.reducers';
import { Map } from 'immutable';

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
			let response = { username: 'scooby', roles: [] };
			let results = getUser(defaultAppState.user, { type: 'user/get', data: response });

			expect(results.get('data')).toEqual(response);
			expect(results.get('status')).toEqual('SUCCESS');
			expect(results.get('error')).toBeUndefined();
		});

		test('should set the current user when a user successfully logs in', () => {
			let response = { username: 'scooby', roles: [] };
			let results = getUser(defaultAppState.user, { type: 'user/login', data: response });

			expect(results.get('data')).toEqual(response);
			expect(results.get('status')).toEqual('SUCCESS');
			expect(results.get('error')).toBeUndefined();
		});

		test('should set the correct status and error when unable to get the current active user', () => {
			let response = new Error('No active user logged in');
			let results = getUser(defaultAppState.user, { type: 'user/get-failure', data: response });

			expect(results.get('status')).toEqual('FAILED');
			expect(results.get('error')).toEqual(response);
		});

		test('should set the correct status and error when a user failed to login', () => {
			let response = new Error('No active user logged in');
			let results = getUser(defaultAppState.user, { type: 'user/login-failure', data: response });

			expect(results.get('status')).toEqual('FAILED');
			expect(results.get('error')).toEqual(response);
		});

		test('should reset the user state on logout', () => {
			let current = defaultAppState.user
				.set('data', new Map({ username: 'Scooby Doo' }))
				.set('status', 'SUCCESS');

			let results = getUser(current, { type: 'user/logout' });

			expect(results.get('data')).not.toBe(current.get('data'));
			expect(results.get('data')).toBe(defaultAppState.user.get('data'));
			expect(results.get('status')).toBe('INCOMPLETE');
		});
	});
});
