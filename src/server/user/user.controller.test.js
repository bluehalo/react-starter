const controller = require('./user.controller');

let generateMockResponse = () => {
	let response = {};

	response.status = jest.fn(() => response);
	response.json = jest.fn(() => response);
	return response;
};

describe('User Controller Tests', () => {
	describe('Method: getActiveUser', () => {
		test('should set success based on whether a user is part of the request', () => {
			let responseWithoutUser = generateMockResponse();
			let responseWithUser = generateMockResponse();
			let requestWithUser = { user: { email: 'foo@bar.edu' } };
			let requestWithoutUser = {};
			// Pass the mocks through
			controller.getActiveUser(requestWithoutUser, responseWithoutUser);
			controller.getActiveUser(requestWithUser, responseWithUser);

			expect(responseWithoutUser.status).toHaveBeenCalledWith(200);
			expect(responseWithUser.status).toHaveBeenCalledWith(200);

			expect(responseWithoutUser.json.mock.calls[0][0].user_data).toEqual({});
			expect(responseWithoutUser.json.mock.calls[0][0].success).toBe(false);

			expect(responseWithUser.json.mock.calls[0][0].user_data).toEqual({ email: 'foo@bar.edu' });
			expect(responseWithUser.json.mock.calls[0][0].success).toBe(true);
		});
	});

	describe('Method: login', () => {
		// TODO: Update when we implement the login functionality
		test('should set success based on a successful login', () => {
			let response = generateMockResponse();
			// Pass our mock through
			controller.login(undefined, response);

			expect(response.status).toHaveBeenCalledWith(200);
			expect(response.json.mock.calls[0][0].user_data).toEqual(undefined);
			expect(response.json.mock.calls[0][0].success).toBe(false);
		});
	});
});
