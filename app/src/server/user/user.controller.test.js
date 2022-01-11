const controller = require('./user.controller');
const { User } = require('./user.model');;

let generateMockResponse = () => {
	let response = {};

	response.status = jest.fn(() => response);
	response.json = jest.fn(() => response);
	return response;
};

describe('User Controller Tests', () => {
	describe('Method: getActiveUser', () => {
		test('should set success based on whether a user is part of the request', () => {
			let response = generateMockResponse();
			let request = {};
			// Pass the mocks through
			controller.getActiveUser(request, response);

			expect(response.status).toHaveBeenCalledWith(200);
			expect(response.json.mock.calls[0][0] instanceof User).toBeTruthy();
		});
	});

	describe('Method: login', () => {
		// TODO: Update when we implement the login functionality
		test('should set success based on a successful login', () => {
			let response = generateMockResponse();
			// Pass our mock through
			controller.login(undefined, response);

			// These will need to be updated when the tests are up to date
			expect(response.status).toHaveBeenCalledWith(200);
			expect(response.json.mock.calls[0][0] instanceof User).toBeTruthy();
		});
	});
});
