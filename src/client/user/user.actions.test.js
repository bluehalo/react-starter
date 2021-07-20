jest.mock('./user.service');

import { getUser } from './user.actions';
import service from './user.service';

describe('User Action Tests', () => {
	afterEach(() => {
		service.__reset();
	});

	describe('action: getUser', () => {
		test('should return user when successfully triggering user/get', () => {
			let expected = { email: 'scooby@mysteryinc.com', roles: ['dog', 'detective'] };
			let action = getUser();
			let dispatch = jest.fn();

			// Set the results of the service
			service.__setResults({ body: { data: expected } });

			return action(dispatch).then(() => {
				// Test that dispatch has been called
				expect(dispatch).toHaveBeenCalledTimes(1);
				// Test that it was called with the correct arguments
				let args = dispatch.mock.calls[0][0];
				expect(args.type).toBe('user/get');
				expect(args.data).toEqual(expected);
			});
		});

		test('should return an error on user/get-failure', () => {
			let expected = new Error('Unable to connect');
			let action = getUser();
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
});
