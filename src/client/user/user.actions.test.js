jest.mock('./user.service');

import { getActiveUser, login, logout } from './user.actions';
import service from './user.service';

describe('User Action Tests', () => {
	afterEach(() => {
		service.__reset();
	});

	describe('action: getActiveUser', () => {
		test('should return user logged in action on success', () => {
			let expected = { email: 'scooby@mysteryinc.com', roles: ['dog', 'detective'] };
			let action = getActiveUser();
			let dispatch = jest.fn();

			// Set the results of the service
			service.__setResults(expected);

			return action(dispatch).then(() => {
				// Test that dispatch has been called
				expect(dispatch).toHaveBeenCalledTimes(1);
				// Test that it was called with the correct arguments
				let args = dispatch.mock.calls[0][0];
				expect(args.type).toBe('user/get');
				expect(args.data).toEqual(expected);
			});
		});

		test('should return user failed login on failure', () => {
			let expected = new Error('Unable to connect');
			let action = getActiveUser();
			let dispatch = jest.fn();

			// Set the results of the service
			service.__setError(expected);

			return action(dispatch).then(() => {
				// Test that dispatch has been called
				expect(dispatch).toHaveBeenCalledTimes(1);
				// Test that it was called with the correct arguments
				let args = dispatch.mock.calls[0][0];
				expect(args.type).toBe('user/get-failure');
				expect(args.data).toEqual(expected);
			});
		});
	});

	describe('action: login', () => {
		test('should dispatch user logged in action on success', () => {
			let user_data = { username: 'ScoobyDoo', email: 'scooby@mysteryinc.com' };
			let expected = { body: { success: true, user_data } };
			let action = login('username', 'password');
			let dispatch = jest.fn();

			// Set the results of the service
			service.__setResults(expected);

			return action(dispatch).then(() => {
				// Test that dispatch has been called
				expect(dispatch).toHaveBeenCalledTimes(1);
				// Test that it was called with the correct arguments
				let args = dispatch.mock.calls[0][0];
				expect(args.type).toBe('user/login');
				expect(args.data).toEqual(expected);
			});
		});

		test('should dispatch authentication failure when username/password is incorrect', () => {
			let expected = new Error('Invalid Password');
			let action = login('username', 'not_password');
			let dispatch = jest.fn();

			// Set the error for the service
			service.__setError(expected);

			return action(dispatch).then(() => {
				// Test that dispatch has been called
				expect(dispatch).toHaveBeenCalledTimes(1);
				// Test that it was called with the correct arguments
				let args = dispatch.mock.calls[0][0];
				expect(args.type).toBe('user/login-failure');
				expect(args.data).toEqual(expected);
			});
		});

		test('should dispatch login failure when http call fails', () => {
			let expected = new Error('Unable to connect');
			let action = login('username', 'password');
			let dispatch = jest.fn();

			// Set the results of the service
			service.__setError(expected);

			return action(dispatch).then(() => {
				// Test that dispatch has been called
				expect(dispatch).toHaveBeenCalledTimes(1);
				// Test that it was called with the correct arguments
				let args = dispatch.mock.calls[0][0];
				expect(args.type).toBe('user/login-failure');
				expect(args.data).toEqual(expected);
			});
		});
	});

	describe('action: logout', () => {
		test('should return a logout action', () => {
			let expected = { type: 'user/logout' };
			expect(logout()).toEqual(expected);
		});
	});
});
